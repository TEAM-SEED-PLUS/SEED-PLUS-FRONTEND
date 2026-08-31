import { useEffect, useState } from 'react';
import {
  getBuilderStoreDetail,
  getMyBookmarkedStores,
  likeBuilderStore,
  unbookmarkBuilderStore,
  unlikeBuilderStore,
} from '@/api';
import type { StoreItem } from '@/components/store';
import { toStoreItem } from '@/pages/StoreBuilder/useStoreBuilderData';

/**
 * 마이페이지 '저장한 상가 리스트' 데이터 훅.
 * 백엔드 '내 북마크 목록' 엔드포인트(getMyBookmarkedStores)에서 실데이터를 가져온다.
 * 북마크 목록이므로 모든 항목은 saved=true.
 */
const useSavedStores = (enabled: boolean) => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingBookmarkIds, setPendingBookmarkIds] = useState<number[]>([]);
  const [pendingLikeIds, setPendingLikeIds] = useState<number[]>([]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;
    setIsLoading(true);
    setErrorMessage('');

    getMyBookmarkedStores({ size: 100 })
      .then((response) => {
        if (!active) {
          return;
        }
        setStores(
          response.content.map((bookmark, index) => ({
            ...toStoreItem(bookmark.store, index),
            saved: true,
            // 최신화 표기는 저장 시점(savedAt) 기준으로 보여준다.
            uploadedAt: bookmark.savedAt,
          }))
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

  // 저장 목록에서 북마크 해제 시 목록에서 제거한다.
  const toggleBookmark = async (store: StoreItem) => {
    if (pendingBookmarkIds.includes(store.id)) {
      return;
    }

    setPendingBookmarkIds((current) => [...current, store.id]);
    try {
      await unbookmarkBuilderStore(store.id);
      setStores((current) => current.filter((item) => item.id !== store.id));
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
    isLoading,
    errorMessage,
    pendingBookmarkIds,
    pendingLikeIds,
    toggleBookmark,
    toggleLike,
  };
};

export default useSavedStores;
