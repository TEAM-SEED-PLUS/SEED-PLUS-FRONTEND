import { QueryClient } from '@tanstack/react-query';

// 서버 상태 캐시(TanStack Query). 화면을 벗어났다 돌아와도 받아둔 응답을 바로 보여주고,
// 오래된 값이면 뒤에서 다시 받아 바뀐 경우에만 화면을 갱신한다.
// 쿼리별 신선도(staleTime)는 각 query options에서 데이터 갱신 주기에 맞춰 정한다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 화면을 다시 볼 때 남겨둘 시간. 그 사이 다시 들어오면 로딩 없이 보인다.
      gcTime: 30 * 60 * 1000,
      // axios 인터셉터가 401 재발급을 처리하므로 일반 실패만 한 번 더 시도한다.
      retry: 1,
      // 탭 전환마다 AI 분석을 다시 부르지 않도록 끈다(신선도는 staleTime으로 관리).
      refetchOnWindowFocus: false,
    },
  },
});
