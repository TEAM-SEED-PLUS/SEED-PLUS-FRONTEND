import { useEffect, useMemo, useState } from 'react';
import {
  bookmarkBuilderStore,
  getBuilderStores,
  getBuilderStoreDetail,
  getIndustries,
  getSeoulDistricts,
  type BuilderStoreSummaryResponse,
  type IndustryResponse,
  type RegionResponse,
  unbookmarkBuilderStore,
} from '@/api';
import type { StoreItem } from '@/components/store/StoreCard';

const toManwonLabel = (amount: number) =>
  `${Math.round(amount / 10000).toLocaleString('ko-KR')}만원`;

const toStoreItem = (
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
  comments: store.commentCount,
  reposts: 0,
});

const useStoreBuilderData = (enabled: boolean) => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | null>(
    null
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [industries, setIndustries] = useState<IndustryResponse[]>([]);
  const [districts, setDistricts] = useState<RegionResponse[]>([]);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [totalStores, setTotalStores] = useState(0);
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingBookmarkIds, setPendingBookmarkIds] = useState<number[]>([]);
  const [interactionError, setInteractionError] = useState('');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;

    Promise.all([getIndustries(), getSeoulDistricts()])
      .then(([industryList, districtList]) => {
        if (!active) {
          return;
        }

        setIndustries(industryList);
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

    getBuilderStores({
      size: 20,
      sort: 'uploadedAt,desc',
      industryId: selectedIndustryId ?? undefined,
      regionId: selectedRegionId ?? undefined,
    })
      .then((response) => {
        if (!active) {
          return;
        }

        setStores(response.content.map(toStoreItem));
        setTotalStores(response.pageInfo.totalElements);
      })
      .catch(() => {
        if (active) {
          setStores([]);
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
  }, [enabled, reloadKey, selectedIndustryId, selectedRegionId]);

  const selectedIndustry = useMemo(
    () =>
      industries.find(
        (industry) => industry.industryId === selectedIndustryId
      ) ?? null,
    [industries, selectedIndustryId]
  );
  const selectedDistrict = useMemo(
    () =>
      districts.find((district) => district.regionId === selectedRegionId) ??
      null,
    [districts, selectedRegionId]
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

    setIsStoreLoading(true);
    setErrorMessage('');
    setSelectedRegionId(regionId);
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

      setStores((current) =>
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

  return {
    stores,
    industries,
    districts,
    totalStores,
    selectedIndustry,
    selectedDistrict,
    selectedIndustryId,
    selectedRegionId,
    isMetadataLoading,
    isStoreLoading,
    errorMessage,
    interactionError,
    pendingBookmarkIds,
    selectIndustry,
    selectDistrict,
    reloadStores,
    toggleBookmark,
  };
};

export default useStoreBuilderData;
