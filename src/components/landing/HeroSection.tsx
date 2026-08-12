import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoHero from '@/assets/landing/logo-hero.png';

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

  return (
    <section className="relative w-full overflow-hidden bg-white py-[100px]">
      <div
        aria-hidden
        className="absolute -top-14 right-[-120px] size-[392px] rounded-full bg-gradient-to-br from-blue-300 to-[#c9e0ff] opacity-70"
      />
      <div
        aria-hidden
        className="absolute bottom-[-200px] left-[42%] size-[393px] rounded-full bg-gradient-to-tr from-blue-300 to-[#c9e0ff] opacity-70"
      />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-[1364px] items-center justify-between gap-10 px-6"
      >
        <div className="max-w-[669px]">
          <motion.h1
            variants={item}
            className="text-[40px] leading-[1.5] font-bold text-[#191f28] md:text-[60px]"
          >
            말이 아닌 <span className="text-blue-600">‘데이터’</span>로
            <br />
            도장을 찍다.
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-10 text-lg leading-[28.8px] font-semibold text-[#606060] md:text-[21px]"
          >
            AI 기반 상권 분석부터
            <br />
            수익률, 생존율 예측, 전문가 연결까지
          </motion.p>
          <motion.p
            variants={item}
            className="mt-4 text-lg leading-[28.8px] font-semibold text-[#606060] md:text-[21px]"
          >
            점포형 창업 의사결정을 위한 올인원 창업 플랫폼
          </motion.p>
          <motion.div variants={item} className="mt-12 flex flex-wrap gap-4">
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
          </motion.div>
        </div>
        <motion.img
          variants={item}
          src={logoHero}
          alt=""
          aria-hidden
          className="hidden w-[420px] shrink-0 lg:block xl:w-[538px]"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
