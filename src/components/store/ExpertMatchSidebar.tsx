import { useState } from 'react';
import ExpertMatchModal from './ExpertMatchModal';
import type { ExpertProfile } from './ExpertMatchModal';

const experts: ExpertProfile[] = [
  {
    id: 'lawyer-kim',
    avatar: '김',
    name: '김변호 변호사',
    role: '최회계 회계사',
    specialty: '상가 임대차 분쟁 / 권리금 전문',
    quote: '스타트업 법률 문제 더 이상 걱정하지 마세요',
    highlights: [
      '전 김앤장 로펌 출신 회계사',
      '서울대 법학전문대 졸업',
      '글로벌 기업 및 대기업 자문',
      '~~전문 변호사',
    ],
  },
  {
    id: 'tax-park',
    avatar: '박',
    name: '박세무 세무사',
    role: '박세무 세무사',
    specialty: '상속/증여 및 법인 전환 전문',
    quote: '복잡한 세금 구조를 명확하게 정리해드립니다',
    highlights: [
      '국세청 세무조사 대응 다수',
      '소상공인 절세 컨설팅 전문',
      '법인 전환 및 증여 설계 자문',
      '상가 세무 리스크 진단',
    ],
  },
  {
    id: 'broker-park',
    avatar: '중',
    name: '박중개 중개사',
    role: '박중개 중개사',
    specialty: '강남/서초 지역 프리미엄 상가',
    quote: '입지와 임대 조건을 함께 보고 판단합니다',
    highlights: [
      '강남권 상가 중개 10년 경력',
      '권리금 및 임대료 협상 전문',
      '프랜차이즈 입점 컨설팅 다수',
      '상권별 유동인구 분석 제공',
    ],
  },
  {
    id: 'account-choi',
    avatar: '최',
    name: '최회계 회계사',
    role: '최회계 회계사',
    specialty: '소상공인 법인기장, 절세전략',
    quote: '매출보다 중요한 현금흐름을 잡아드립니다',
    highlights: [
      '전 김앤장 로펌 출신 회계사',
      '서울대 법학전문대 졸업',
      '글로벌 기업 및 대기업 자문',
      '상가 창업 재무계획 전문',
    ],
  },
];

const ExpertMatchSidebar = () => {
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(
    null
  );

  return (
    <>
      <aside className="fixed right-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[264px] border-l border-[#e5e8eb] bg-white px-5 py-5 2xl:block">
        <h2 className="text-base font-extrabold text-[#191f28]">전문가 매칭</h2>

        <div className="mt-4 space-y-2">
          {experts.map((expert) => (
            <button
              key={expert.id}
              type="button"
              onClick={() => setSelectedExpert(expert)}
              className="flex w-full items-center gap-3 rounded-md border border-[#e5e8eb] bg-white px-3 py-3 text-left transition hover:border-blue-600 hover:bg-blue-300/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-500 text-base font-extrabold text-blue-600">
                {expert.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-extrabold text-[#191f28]">
                  {expert.name}
                </div>
                <div className="mt-1 truncate text-xs font-medium text-gray-46">
                  {expert.specialty}
                </div>
              </div>
              <span className="text-2xl text-[#8b95a1]">›</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 h-10 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
        >
          더보기
        </button>
      </aside>

      {selectedExpert && (
        <ExpertMatchModal
          expert={selectedExpert}
          onClose={() => setSelectedExpert(null)}
        />
      )}
    </>
  );
};

export default ExpertMatchSidebar;
