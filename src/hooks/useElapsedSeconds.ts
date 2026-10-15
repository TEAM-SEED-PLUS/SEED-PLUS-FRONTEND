import { useEffect, useState } from 'react';

/**
 * 마운트된 뒤 흐른 초. 오래 걸리는 요청의 로딩 화면에서 멈춘 것으로 오인하지 않도록 쓴다.
 * 요청이 바뀌어 0부터 다시 세야 하면 부모에서 key를 바꿔 다시 마운트한다.
 */
export const useElapsedSeconds = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(
      () => setElapsedSeconds((current) => current + 1),
      1000
    );
    return () => window.clearInterval(timerId);
  }, []);

  return elapsedSeconds;
};
