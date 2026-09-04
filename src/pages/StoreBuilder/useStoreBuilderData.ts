import { useEffect, useMemo, useState } from 'react';
import {
  bookmarkBuilderStore,
  getAnalysisIndustries,
  getBuilderStores,
  getBuilderStoreDetail,
  getIndustries,
  getSeoulDistricts,
  getSeoulLegalDongs,
  likeBuilderStore,
  type BuilderStoreSummaryResponse,
  type IndustryResponse,
  type RegionResponse,
  unbookmarkBuilderStore,
  unlikeBuilderStore,
} from '@/api';
import type { StoreItem } from '@/components/store/StoreCard';

const toManwonLabel = (amount: number) =>
  `${Math.round(amount / 10000).toLocaleString('ko-KR')}만원`;

export const toStoreItem = (
  store: BuilderStoreSummaryResponse,
  index: number
): StoreItem => ({
  id: store.builderStoreId,
  name: store.name,
  category: store.industry.name,
  district: [store.region.sigungu, store.region.dong].filter(Boolean).join(' '),
  area: `${store.area}m²`,
  sales: toManwonLabel(store.expectedMonthlySales),
  profit: `${store.expectedProfitRate}%`,
  payback: `${store.investmentPaybackMonths}개월`,
  rank: index + 1,
  score: store.propertyScore,
  likes: store.likeCount,
  reposts: 0,
  saved: store.bookmarked,
  liked: store.liked,
  areaValue: store.area,
  expectedMonthlySalesValue: store.expectedMonthlySales,
  expectedProfitRateValue: store.expectedProfitRate,
  depositValue: store.deposit,
  monthlyRentValue: store.monthlyRent,
  uploadedAt: store.uploadedAt,
});

const applyStoreInteractionState = async (stores: StoreItem[]) => {
  const storesMissingInteractionState = stores.filter(
    (store) => store.liked === undefined || store.saved === undefined
  );

  if (storesMissingInteractionState.length === 0) {
    return stores;
  }

  const details = await Promise.allSettled(
    storesMissingInteractionState.map((store) =>
      getBuilderStoreDetail(store.id)
    )
  );

  const detailByStoreId = new Map(
    details
      .map((detail) => (detail.status === 'fulfilled' ? detail.value : null))
      .filter((detail) => detail !== null)
      .map((detail) => [detail.builderStoreId, detail])
  );

  return stores.map((store) => {
    const detail = detailByStoreId.get(store.id);

    if (!detail) {
      return store;
    }

    return {
      ...store,
      liked: detail.liked,
      saved: detail.bookmarked,
    };
  });
};

export type StoreRangeFilterValue = {
  label: string;
  min?: number;
  max?: number;
};

export type StoreRangeFilterKey =
  | 'area'
  | 'sales'
  | 'profit'
  | 'premium'
  | 'rent';

export type StoreRangeFilters = Record<
  StoreRangeFilterKey,
  StoreRangeFilterValue
>;

const defaultRangeFilters: StoreRangeFilters = {
  area: { label: '면적' },
  sales: { label: '예상매출' },
  profit: { label: '수익률' },
  premium: { label: '권리금' },
  rent: { label: '임대료' },
};

const isInRange = (
  value: number,
  filter: StoreRangeFilterValue,
  normalize: (value: number) => number = (current) => current
) => {
  const normalizedValue = normalize(value);
  if (filter.min !== undefined && normalizedValue < filter.min) {
    return false;
  }
  if (filter.max !== undefined && normalizedValue > filter.max) {
    return false;
  }
  return true;
};

const useStoreBuilderData = (enabled: boolean) => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | null>(
    null
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [rangeFilters, setRangeFilters] =
    useState<StoreRangeFilters>(defaultRangeFilters);
  const [rawStores, setRawStores] = useState<StoreItem[]>([]);
  const [industries, setIndustries] = useState<IndustryResponse[]>([]);
  const [analysisIndustries, setAnalysisIndustries] = useState<
    IndustryResponse[]
  >([]);
  const [districts, setDistricts] = useState<RegionResponse[]>([]);
  const [legalDongs, setLegalDongs] = useState<RegionResponse[]>([]);
  const [totalStores, setTotalStores] = useState(0);
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingBookmarkIds, setPendingBookmarkIds] = useState<number[]>([]);
  const [pendingLikeIds, setPendingLikeIds] = useState<number[]>([]);
  const [interactionError, setInteractionError] = useState('');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;

    Promise.all([
      getIndustries(),
      getAnalysisIndustries(),
      getSeoulDistricts(),
      getSeoulLegalDongs(),
    ])
      .then(([industryList, analysisIndustryList, districtList, dongList]) => {
        if (!active) {
          return;
        }

        setIndustries(industryList);
        setAnalysisIndustries(analysisIndustryList);
        setLegalDongs(dongList);
        setDistricts(
          [...districtList].sort((left, right) =>
            left.sigungu.localeCompare(right.sigungu, 'ko-KR')
          )
        );
      })
      .catch(() => {
        if (active) {
          setErrorMessage('필터 목록을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (active) {
          setIsMetadataLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;

    setIsStoreLoading(true);

    getBuilderStores({
      size: 100,
      sort: 'uploadedAt,desc',
      industryId: selectedIndustryId ?? undefined,
      // regionId는 보내지 않는다: 상가는 법정동 행에 연결되는데 사이드바는
      // 자치구(SIGUNGU) id라 서버 exact-match 필터가 항상 0건을 돌려준다.
      // 구 필터는 아래 stores 메모에서 sigungu 이름으로 클라이언트 필터링한다.
      // TODO(BE): regionId 계층(구→동) 매칭 지원 시 서버 필터로 복귀.
      minArea: rangeFilters.area.min,
      maxArea: rangeFilters.area.max,
    })
      .then(async (response) => {
        if (!active) {
          return;
        }

        const nextStores = await applyStoreInteractionState(
          response.content.map(toStoreItem)
        );

        if (!active) {
          return;
        }

        setRawStores(nextStores);
        setTotalStores(response.pageInfo.totalElements);
      })
      .catch(() => {
        if (active) {
          setRawStores([]);
          setErrorMessage('상가 목록을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (active) {
          setIsStoreLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    enabled,
    rangeFilters.area.max,
    rangeFilters.area.min,
    reloadKey,
    selectedIndustryId,
  ]);

  const selectedDistrict = useMemo(
    () =>
      districts.find((district) => district.regionId === selectedRegionId) ??
      null,
    [districts, selectedRegionId]
  );

  const stores = useMemo(
    () =>
      rawStores.filter(
        (store) =>
          (!selectedDistrict ||
            store.district.startsWith(selectedDistrict.sigungu)) &&
          isInRange(
            store.expectedMonthlySalesValue,
            rangeFilters.sales,
            (value) => Math.round(value / 10000)
          ) &&
          isInRange(store.expectedProfitRateValue, rangeFilters.profit) &&
          isInRange(store.depositValue, rangeFilters.premium, (value) =>
            Math.round(value / 10000)
          ) &&
          isInRange(store.monthlyRentValue, rangeFilters.rent, (value) =>
            Math.round(value / 10000)
          )
      ),
    [rawStores, rangeFilters, selectedDistrict]
  );

  const selectedIndustry = useMemo(
    () =>
      industries.find(
        (industry) => industry.industryId === selectedIndustryId
      ) ?? null,
    [industries, selectedIndustryId]
  );
  const selectIndustry = (industryId: number | null) => {
    if (industryId === selectedIndustryId) {
      return;
    }

    setIsStoreLoading(true);
    setErrorMessage('');
    setSelectedIndustryId(industryId);
  };

  const selectDistrict = (regionId: number | null) => {
    if (regionId === selectedRegionId) {
      return;
    }

    // 구 필터는 클라이언트 필터링이라 리페치가 없다 — 로딩을 켜면 안 꺼진다.
    setErrorMessage('');
    setSelectedRegionId(regionId);
  };

  const applyRangeFilter = (
    key: StoreRangeFilterKey,
    nextFilter: StoreRangeFilterValue
  ) => {
    setIsStoreLoading(true);
    setErrorMessage('');
    setRangeFilters((current) => ({ ...current, [key]: nextFilter }));
    if (key !== 'area') {
      window.setTimeout(() => setIsStoreLoading(false), 120);
    }
  };

  const resetRangeFilter = (key: StoreRangeFilterKey) => {
    setIsStoreLoading(true);
    setErrorMessage('');
    setRangeFilters((current) => ({
      ...current,
      [key]: defaultRangeFilters[key],
    }));
    if (key !== 'area') {
      window.setTimeout(() => setIsStoreLoading(false), 120);
    }
  };

  const resetFilters = () => {
    setIsStoreLoading(true);
    setErrorMessage('');
    setSelectedIndustryId(null);
    setSelectedRegionId(null);
    setRangeFilters({ ...defaultRangeFilters });
    window.setTimeout(() => setIsStoreLoading(false), 120);
  };

  const reloadStores = () => {
    setIsStoreLoading(true);
    setErrorMessage('');
    setReloadKey((current) => current + 1);
  };

  const toggleBookmark = async (store: StoreItem) => {
    if (pendingBookmarkIds.includes(store.id)) {
      return;
    }

    setInteractionError('');
    setPendingBookmarkIds((current) => [...current, store.id]);
    try {
      const currentSaved =
        store.saved ?? (await getBuilderStoreDetail(store.id)).bookmarked;

      if (currentSaved) {
        await unbookmarkBuilderStore(store.id);
      } else {
        await bookmarkBuilderStore(store.id);
      }

      setRawStores((current) =>
        current.map((item) =>
          item.id === store.id ? { ...item, saved: !currentSaved } : item
        )
      );
    } catch {
      setInteractionError('북마크 상태를 변경하지 못했습니다.');
    } finally {
      setPendingBookmarkIds((current) =>
        current.filter((id) => id !== store.id)
      );
    }
  };

  const toggleLike = async (store: StoreItem) => {
    if (pendingLikeIds.includes(store.id)) {
      return;
    }

    setInteractionError('');
    setPendingLikeIds((current) => [...current, store.id]);
    try {
      const currentLiked =
        store.liked ?? (await getBuilderStoreDetail(store.id)).liked;

      if (currentLiked) {
        await unlikeBuilderStore(store.id);
      } else {
        await likeBuilderStore(store.id);
      }

      setRawStores((current) =>
        current.map((item) =>
          item.id === store.id
            ? {
                ...item,
                liked: !currentLiked,
                likes: item.likes + (currentLiked ? -1 : 1),
              }
            : item
        )
      );
    } catch {
      setInteractionError('좋아요 상태를 변경하지 못했습니다.');
    } finally {
      setPendingLikeIds((current) => current.filter((id) => id !== store.id));
    }
  };

  return {
    stores,
    industries,
    analysisIndustries,
    districts,
    legalDongs,
    totalStores,
    selectedIndustry,
    selectedDistrict,
    selectedIndustryId,
    selectedRegionId,
    rangeFilters,
    isMetadataLoading,
    isStoreLoading,
    errorMessage,
    interactionError,
    pendingBookmarkIds,
    pendingLikeIds,
    selectIndustry,
    selectDistrict,
    applyRangeFilter,
    resetRangeFilter,
    resetFilters,
    reloadStores,
    toggleBookmark,
    toggleLike,
  };
};

export default useStoreBuilderData;
