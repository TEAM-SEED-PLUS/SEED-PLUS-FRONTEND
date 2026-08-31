import { domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoHero from '@/assets/landing/logo-hero.png';

// 번들 최적화: 전체 기능이 딸려오는 motion.* 대신 경량 m.* + LazyMotion을 쓴다.
// domAnimation은 애니메이션·variants만 포함하고 drag/pan/layout은 제외된다(gzip 약 14KB 절감).
// 추후 drag·AnimatePresence 등이 필요해지면 features를 domMax로 올리거나 motion.*로 전환.
const HeroSection = () => {
  // 접근성: 사용자가 OS에서 '동작 줄이기'를 켠 경우 이동 애니메이션을 생략한다.
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
    },
  };

  const item = shouldReduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' as const },
        },
      };

  // 첫 진입에서 히어로가 화면을 정확히 채우도록 뷰포트 높이에 맞춘다.
  // 헤더가 sticky h-[88px]로 흐름에 남아 있어 그만큼 빼야 헤더+히어로 = 한 화면이 된다.
  // dvh를 쓰는 이유는 모바일 브라우저 주소창 높이 변화 대응(100vh는 잘림).
  // 모바일에서는 우측 로고가 숨겨져 여백만 늘어나므로 md 이상에서만 적용한다.
  return (
    <section className="relative w-full snap-start overflow-hidden bg-white py-[100px] md:flex md:min-h-[calc(100dvh-88px)] md:items-center">
      <div
        aria-hidden
        className="absolute -top-14 right-[-120px] size-[392px] rounded-full bg-gradient-to-br from-blue-300 to-[#c9e0ff] opacity-70"
      />
      <div
        aria-hidden
        className="absolute bottom-[-200px] left-[42%] size-[393px] rounded-full bg-gradient-to-tr from-blue-300 to-[#c9e0ff] opacity-70"
      />
      <LazyMotion features={domAnimation}>
        <m.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex w-full max-w-[1364px] items-center justify-between gap-10 px-6"
        >
          <div className="max-w-[669px]">
            <m.h1
              variants={item}
              className="text-[40px] leading-[1.5] font-bold text-[#191f28] md:text-[60px]"
            >
              창업에 <span className="text-blue-600">확신</span>을 더하다
              <br />
              시드플러스
            </m.h1>
            <m.p
              variants={item}
              className="mt-10 text-lg leading-[28.8px] font-semibold text-[#606060] md:text-[21px]"
            >
              창업비용 비교, 예상매출, 입지조건 등
              <br />
              복잡한 창업 고민들을 위한
              <br />
              올인원 솔루션 서비스{' '}
              <strong className="font-bold text-[#191f28]">시드플러스</strong>
              입니다
            </m.p>
            <m.div variants={item} className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-xl bg-blue-600 px-7 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                회원 가입 하러가기
              </Link>
              <a
                href="#about"
                className="rounded-xl border border-blue-600 bg-white px-7 py-4 text-base text-blue-600 transition-colors hover:bg-blue-300"
              >
                서비스 소개 보기
              </a>
            </m.div>
          </div>
          <m.img
            variants={item}
            src={logoHero}
            alt=""
            aria-hidden
            className="hidden w-[420px] shrink-0 lg:block xl:w-[538px]"
          />
        </m.div>
      </LazyMotion>
    </section>
  );
};

export default HeroSection;
