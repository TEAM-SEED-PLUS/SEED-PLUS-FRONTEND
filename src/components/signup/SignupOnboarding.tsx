import { useState } from 'react';

type OnboardingStep = {
  title: string;
  options: string[];
};

interface SignupOnboardingProps {
  onComplete: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: '가입 경로를 선택해주세요.',
    options: [
      '인스타그램',
      '페이스북',
      '유튜브',
      '틱톡',
      'X (트위터)',
      '네이버',
      '구글',
      '카카오',
      '지인 소개',
      '오프라인 광고',
      '커뮤니티, 카페 추천',
      '기타',
    ],
  },
  {
    title: '현재 창업/운영 상황을 선택해 주세요.',
    options: [
      '창업을 고민 중',
      '상권을 알아보는 중',
      '점포를 찾는 중',
      '계약 직전',
      '이미 운영 중',
      '폐업 후 재도전 준비',
      '기타',
    ],
  },
  {
    title: '관심 있으신 창업 업종을 선택해 주세요.',
    options: [
      '카페 / 디저트',
      '일반 음식점',
      '주점',
      '무인매장',
      '뷰티',
      '헬스',
      '소매업',
      '기타',
    ],
  },
];

const initialAnswers = onboardingSteps.map((step) => [step.options[0]]);

const SignupOnboarding = ({ onComplete }: SignupOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(initialAnswers);
  const [otherAnswers, setOtherAnswers] = useState(['', '', '']);
  const step = onboardingSteps[currentStep];
  const selectedAnswers = answers[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const toggleOption = (option: string) => {
    setAnswers((previous) =>
      previous.map((items, index) => {
        if (index !== currentStep) {
          return items;
        }

        return items.includes(option)
          ? items.filter((item) => item !== option)
          : [...items, option];
      })
    );
  };

  const handleConfirm = () => {
    if (isLastStep) {
      onComplete();
      return;
    }

    setCurrentStep((previous) => previous + 1);
  };

  return (
    <div className="flex min-h-140 flex-col">
      <div className="text-center">
        <h1 className="text-xl font-extrabold text-[#191f28]">{step.title}</h1>
        <p className="mt-5 text-sm font-medium text-[#4e5968]">
          보내주신 답변을 바탕으로 더욱 발전하는 SEED+가 되겠습니다.
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-5">
        {step.options.map((option) => (
          <label
            key={option}
            className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#191f28]"
          >
            <input
              type="checkbox"
              checked={selectedAnswers.includes(option)}
              onChange={() => toggleOption(option)}
              className="h-4 w-4 rounded border-[#d8dde5] accent-blue-600"
            />
            {option}
          </label>
        ))}

        {selectedAnswers.includes('기타') && (
          <input
            type="text"
            value={otherAnswers[currentStep]}
            onChange={(event) =>
              setOtherAnswers((previous) =>
                previous.map((answer, index) =>
                  index === currentStep ? event.target.value : answer
                )
              )
            }
            placeholder="직접 입력해주세요."
            className="h-12 w-full rounded-sm border border-[#d8dde5] px-4 text-sm text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
          />
        )}
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        className="mt-6 h-14 w-full rounded-md bg-blue-600 text-base font-extrabold text-white transition-colors hover:bg-[#1f6fe5]"
      >
        확인
      </button>
    </div>
  );
};

export default SignupOnboarding;
