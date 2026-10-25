import { useCallback, useEffect, useMemo, useState } from 'react';
import { getApiErrorMessage } from '@/api';

type SupportDataState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: unknown; message: string }
  | { status: 'success'; data: T };

type SettledResult<T> = {
  request: object;
  state: Exclude<SupportDataState<T>, { status: 'loading' }>;
};

/**
 * 고객지원 화면의 단순 조회 상태. load가 바뀌거나 retry하면 다시 불러오고,
 * 그 사이 언마운트·재요청되면 늦게 온 응답은 버린다.
 * 현재 요청의 결과가 아직 없으면 loading으로 본다.
 */
export const useSupportData = <T>(load: () => Promise<T>) => {
  const [attempt, setAttempt] = useState(0);
  const request = useMemo(() => ({ load, attempt }), [load, attempt]);
  const [result, setResult] = useState<SettledResult<T> | null>(null);

  useEffect(() => {
    let ignore = false;
    request.load().then(
      (data) => {
        if (!ignore) {
          setResult({ request, state: { status: 'success', data } });
        }
      },
      (error: unknown) => {
        if (!ignore) {
          setResult({
            request,
            state: {
              status: 'error',
              error,
              message: getApiErrorMessage(error),
            },
          });
        }
      }
    );
    return () => {
      ignore = true;
    };
  }, [request]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  const state: SupportDataState<T> =
    result?.request === request ? result.state : { status: 'loading' };

  return { state, retry };
};
