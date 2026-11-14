/**
 * "이 브라우저에 로그인 세션이 있었다"는 흔적.
 *
 * 로그인 여부는 서버에 물어봐야(csrf → reissue) 확정되는데 1~2초가 걸린다.
 * 그동안 화면이 무엇을 먼저 보여줄지 정하는 데만 쓴다. 인증 판단에는 쓰지 않는다.
 */
const SESSION_HINT_KEY = 'seed_plus_session_hint';

export const hasSessionHint = () => {
  try {
    return window.localStorage.getItem(SESSION_HINT_KEY) === '1';
  } catch {
    return false;
  }
};

export const setSessionHint = (hasSession: boolean) => {
  try {
    if (hasSession) {
      window.localStorage.setItem(SESSION_HINT_KEY, '1');
    } else {
      window.localStorage.removeItem(SESSION_HINT_KEY);
    }
  } catch {
    // 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서는 흔적 없이 동작한다.
  }
};
