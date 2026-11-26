import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getIndustries, getSeoulDistricts } from '@/api';
import { useAuth } from '@/auth';
import { MobileStoreSidebar } from '@/components/store';
import type { StoreBuilderIntent } from '@/components/store';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const METADATA_STALE_TIME_MS = 10 * 60 * 1000;

/**
 * 내 상가 만들기 밖의 화면에서 여는 모바일 메뉴.
 *
 * 내 상가 만들기의 모바일 메뉴와 같은 화면을 쓴다. 다만 필터와 계산기는 그 화면의 기능이라,
 * 여기서 고르면 내 상가 만들기로 이동하면서 고른 내용을 함께 넘긴다.
 */
const MobileNavMenu = ({ isOpen, onClose }: MobileNavMenuProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // 업종·지역 목록은 메뉴를 처음 열 때 받는다(회원만).
  const shouldLoad = isOpen && isAuthenticated;
  const industriesQuery = useQuery({
    queryKey: ['store-builder', 'industries'],
    queryFn: () => getIndustries(),
    enabled: shouldLoad,
    staleTime: METADATA_STALE_TIME_MS,
  });
  const districtsQuery = useQuery({
    queryKey: ['store-builder', 'districts'],
    queryFn: async () =>
      [...(await getSeoulDistricts())].sort((left, right) =>
        left.sigungu.localeCompare(right.sigungu, 'ko-KR')
      ),
    enabled: shouldLoad,
    staleTime: METADATA_STALE_TIME_MS,
  });

  const goToStoreBuilder = (intent: StoreBuilderIntent) => {
    onClose();
    navigate('/store-builder', { state: intent });
  };

  return (
    <MobileStoreSidebar
      isOpen={isOpen}
      onClose={onClose}
      createStoreHref="/store-builder"
      showStoreTools={isAuthenticated}
      onOpenRevenueCalculator={() =>
        goToStoreBuilder({ openCalculator: 'revenue' })
      }
      onOpenSurvivalCalculator={() =>
        goToStoreBuilder({ openCalculator: 'survival' })
      }
      industries={industriesQuery.data ?? []}
      districts={districtsQuery.data ?? []}
      totalStores={null}
      selectedIndustryId={null}
      selectedRegionId={null}
      isLoading={industriesQuery.isPending || districtsQuery.isPending}
      onSelectIndustry={(industryId) =>
        goToStoreBuilder(industryId === null ? {} : { industryId })
      }
      onSelectDistrict={(regionId) =>
        goToStoreBuilder(regionId === null ? {} : { regionId })
      }
    />
  );
};

export default MobileNavMenu;
