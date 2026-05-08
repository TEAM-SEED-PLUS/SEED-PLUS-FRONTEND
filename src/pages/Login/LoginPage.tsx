import { HeaderUser } from '@/components/layout';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef5ff] via-white to-white">
      <HeaderUser activeNav="login" />
      <main className="flex min-h-screen items-center justify-center px-6 pt-[var(--header-height)]">
        <section className="w-full max-w-[470px] rounded-2xl bg-white px-11 py-10 shadow-[0_20px_60px_rgba(49,130,246,0.14)]">
          <div>
            <div className="text-2xl font-extrabold text-blue-600">
              SEED+ MLS
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-[#191f28]">
              점포주 로그인
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-46">
              내 점포 데이터를 관리하고 스마트하게 운영하세요
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 border-b border-[#e5e8eb] text-center text-sm font-extrabold">
            <button
              type="button"
              className="border-b-2 border-blue-600 pb-3 text-blue-600"
            >
              휴대폰 번호로 로그인
            </button>
            <button type="button" className="pb-3 text-gray-46">
              QR코드로 로그인
            </button>
          </div>

          <form className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                className="h-12 rounded-lg border border-[#e5e8eb] px-4 text-sm font-medium outline-none placeholder:text-gray-46 focus:border-blue-600"
                placeholder="이름"
              />
              <input
                type="text"
                className="h-12 rounded-lg border border-[#e5e8eb] px-4 text-sm font-medium outline-none placeholder:text-gray-46 focus:border-blue-600"
                placeholder="생년월일 6자리"
              />
            </div>

            <input
              type="tel"
              className="mt-3 h-12 w-full rounded-lg border border-[#e5e8eb] px-4 text-sm font-medium outline-none placeholder:text-gray-46 focus:border-blue-600"
              placeholder="휴대폰 번호"
            />

            <label className="mt-7 flex items-center gap-3 text-sm font-extrabold text-[#191f28]">
              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 accent-blue-600"
              />
              필수 약관에 모두 동의
            </label>

            <div className="mt-4 border-t border-[#e5e8eb] pt-4">
              <label className="flex items-center justify-between py-2 text-sm font-medium text-gray-46">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 accent-blue-600"
                  />
                  개인정보 수집·이용 동의 (점포주 인증)
                </span>
                <button type="button" className="text-[#b0b8c1]">
                  ›
                </button>
              </label>
              <label className="flex items-center justify-between py-2 text-sm font-medium text-gray-46">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 accent-blue-600"
                  />
                  개인정보 제3자 제공 동의 (데이터 분석)
                </span>
                <button type="button" className="text-[#b0b8c1]">
                  ›
                </button>
              </label>
            </div>

            <button
              type="submit"
              className="mt-7 h-14 w-full rounded-lg bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
            >
              로그인
            </button>
          </form>

          <div className="mt-5 space-y-2 text-center text-sm font-medium">
            <button type="button" className="text-blue-600">
              앱 없이 로그인하기
            </button>
            <div className="text-gray-46">
              아직 회원이 아닌가요?{' '}
              <button type="button" className="text-blue-600">
                가입하기
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
