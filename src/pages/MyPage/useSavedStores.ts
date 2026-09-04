import { useEffect, useState } from 'react';
import {
  bookmarkBuilderStore,
  getBuilderStoreDetail,
  getBuilderStores,
  getMyBookmarkedStores,
  getMyBuilderStores,
  likeBuilderStore,
  unbookmarkBuilderStore,
  unlikeBuilderStore,
} from '@/api';
import type { StoreItem } from '@/components/store';
import {
  applyStoreInteractionState,
  buildRankByStoreId,
  toStoreItem,
} from '@/pages/StoreBuilder/useStoreBuilderData';

/**
 * 마이페이지 '저장한 상가 리스트' 데이터 훅.
 * 백엔드에서 '내가 생성한 상가'(/users/me/builder-stores)와
 * '북마크한 상가'(/users/me/builder-stores/bookmarks)가 분리돼 있어
 * 둘을 합쳐 보여준다. 계산기 '저장하기'로 만든 상가는 생성 목록에만 쌓인다.
 */
const useSavedStores = (enabled: boolean) => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingBookmarkIds, setPendingBookmarkIds] = useState<number[]>([]);
  const [pendingLikeIds, setPendingLikeIds] = useState<number[]>([]);
  // 내가 생성한 상가 id — 북마크 해제 시 목록 유지 여부 판단에 쓴다.
  const [createdIds, setCreatedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;
    setIsLoading(true);
    setErrorMessage('');

    Promise.all([
      getMyBuilderStores({ size: 100 }),
      getMyBookmarkedStores({ size: 100 }),
      // '내 상가 만들기'와 같은 랭킹을 표시하기 위한 전체 목록(좋아요 랭킹 산정용)
      getBuilderStores({ size: 100, sort: 'uploadedAt,desc' }),
    ])
      .then(async ([mine, bookmarks, allStores]) => {
        if (!active) {
          return;
        }
        const rankByStoreId = buildRankByStoreId(allStores.content);
        const bookmarked = bookmarks.content.map((bookmark) => ({
          ...toStoreItem(bookmark.store),
          rank: rankByStoreId.get(bookmark.store.builderStoreId),
          saved: true,
          // 최신화 표기는 저장 시점(savedAt) 기준으로 보여준다.
          uploadedAt: bookmark.savedAt,
        }));
        const bookmarkedIds = new Set(bookmarked.map((item) => item.id));
        setCreatedIds(
          new Set(mine.content.map((store) => store.builderStoreId))
        );
        const created = mine.content
          .filter((store) => !bookmarkedIds.has(store.builderStoreId))
          .map((store) => ({
            ...toStoreItem(store),
            rank: rankByStoreId.get(store.builderStoreId),
            saved: false,
          }));
        // 목록 요약에는 liked가 없으므로 상세 조회로 하트 상태를 채운다.
        // TODO(BE): 목록 응답에 liked 포함 시 이 보정 제거.
        const merged = await applyStoreInteractionState(
          [...bookmarked, ...created].sort((left, right) =>
            (right.uploadedAt ?? '').localeCompare(left.uploadedAt ?? '')
          )
        );
        if (!active) {
          return;
        }
        setStores(
          merged.map((store) =>
            bookmarkedIds.has(store.id) ? { ...store, saved: true } : store
          )
        );
      })
      .catch(() => {
        if (active) {
          setErrorMessage('저장한 상가를 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  // 북마크 상가는 해제, 생성 상가는 북마크 추가로 토글한다.
  const toggleBookmark = async (store: StoreItem) => {
    if (pendingBookmarkIds.includes(store.id)) {
      return;
    }

    setPendingBookmarkIds((current) => [...current, store.id]);
    try {
      if (store.saved) {
        await unbookmarkBuilderStore(store.id);
        // 내가 생성한 상가는 해제 후에도 목록에 남고, 남의 상가는 제거한다.
        setStores((current) =>
          createdIds.has(store.id)
            ? current.map((item) =>
                item.id === store.id ? { ...item, saved: false } : item
              )
            : current.filter((item) => item.id !== store.id)
        );
      } else {
        await bookmarkBuilderStore(store.id);
        setStores((current) =>
          current.map((item) =>
            item.id === store.id ? { ...item, saved: true } : item
          )
        );
      }
    } catch {
      setErrorMessage('북마크 상태를 변경하지 못했습니다.');
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

    setPendingLikeIds((current) => [...current, store.id]);
    try {
      const currentLiked =
        store.liked ?? (await getBuilderStoreDetail(store.id)).liked;

      if (currentLiked) {
        await unlikeBuilderStore(store.id);
      } else {
        await likeBuilderStore(store.id);
      }

      setStores((current) =>
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
      setErrorMessage('좋아요 상태를 변경하지 못했습니다.');
    } finally {
      setPendingLikeIds((current) => current.filter((id) => id !== store.id));
    }
  };

  return {
    stores,
    createdIds,
    isLoading,
    errorMessage,
    pendingBookmarkIds,
    pendingLikeIds,
    toggleBookmark,
    toggleLike,
  };
};

export default useSavedStores;
