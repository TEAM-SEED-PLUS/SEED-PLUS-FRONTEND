import stepApply from '@/assets/landing/step-apply.svg';
import stepReview from '@/assets/landing/step-review.svg';
import stepConnect from '@/assets/landing/step-connect.svg';

const steps = [
  { icon: stepApply, label: '파트너 신청', bare: true },
  { icon: stepReview, label: '파트너 검토 및 승인', bare: false },
  { icon: stepConnect, label: '검토 후 고객 연결 시작', bare: false },
];

const UsageSection = () => {
  return (
    <section id="usage" className="w-full scroll-mt-[88px] bg-white py-30">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <h2 className="text-center text-[34px] font-bold text-[#191f28] md:text-[52px]">
          SEED+는 이렇게 작동합니다
        </h2>
        <p className="mt-3 text-center text-lg leading-[30px] font-medium text-black md:text-xl">
          실거래 데이터와 AI 분석자료를 활용해
          <br />
          <strong className="font-bold">
            &quot;전문적인 창업 컨설턴트형 중개사&quot;
          </strong>
          <br />
          이미지 형성이 가능합니다.
        </p>
        <div className="mt-[70px] flex flex-col items-center justify-center gap-10 md:flex-row md:gap-[60px]">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex items-center gap-10 md:gap-[60px]"
            >
              {index > 0 && (
                <span
                  aria-hidden
                  className="hidden text-[40px] text-[#a5b8d7] md:block"
                >
                  →
                </span>
              )}
              <div className="flex flex-col items-center">
                {step.bare ? (
                  <img src={step.icon} alt="" className="size-[181px]" />
                ) : (
                  <div className="flex size-[181px] items-center justify-center rounded-full border-2 border-[#dbe7ff]">
                    <img src={step.icon} alt="" className="size-[92px]" />
                  </div>
                )}
                <h3 className="pt-5 text-xl font-bold text-[#191f28] md:text-[23px]">
                  {step.label}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsageSection;
