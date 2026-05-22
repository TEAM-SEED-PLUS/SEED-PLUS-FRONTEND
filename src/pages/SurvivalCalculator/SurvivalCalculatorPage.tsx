import { Link, Navigate } from 'react-router-dom';
import SEEDPLUS from '@/assets/SEEDPLUS.png';
import { getMockAuthenticated } from '@/utils/auth';

const dataBadges = [
  '소상공인시장진흥공단 상권정보',
  '서울시 열린데이터광장',
  '국토교통부 실거래가',
  '여신금융협회 카드 매출',
  'KT 유동인구 데이터',
  '행정안전부 인허가 데이터',
];

const variableFactors = [
  '상권 평균 매출 수준',
  '최근 매출 성장률',
  '동일업종 점포 밀도',
  '상권 공실률',
  '유동인구 수준',
  '휴·폐업 변동 빈도',
];

const scoreItems = [
  {
    label: '매출 안정성',
    description: '상권 평균 매출 상위권',
    value: '+20',
    positive: true,
  },
  {
    label: '상권 성장성',
    description: '최근 매출 상승',
    value: '+9',
    positive: true,
  },
  {
    label: '경쟁 강도',
    description: '동일업종 밀도 과밀',
    value: '-20',
    positive: false,
  },
  {
    label: '공실 리스크',
    description: '공실률 보통',
    value: '+0',
    positive: true,
  },
  {
    label: '유동인구',
    description: '유동인구 매우 많음',
    value: '-20',
    positive: false,
  },
  {
    label: '입차 부담',
    description: '임차부담도 53%',
    value: '+0',
    positive: true,
  },
  {
    label: '상권 안정성',
    description: '폐폐 변동 안정',
    value: '+20',
    positive: true,
  },
  { label: '창업 형태', description: '신규창업', value: '+0', positive: true },
];

const riskItems = [
  {
    title: '1위 동일업종 과밀 경쟁',
    score: '-20점',
    description:
      '선택 상권의 카페 상권은 신규 점포의 고객 확보가 어렵습니다. 차별화 전략이 필수입니다.',
  },
  {
    title: '2위 임차 부담 과중',
    score: '-20점',
    description:
      '월세가 예상 매출의 47%로 업종 권장 기준을 초과합니다. 수익성 악화 위험이 높습니다.',
  },
  {
    title: '3위 임차 부담 과중',
    score: '-20점',
    description:
      '월세가 예상 매출의 47%로 업종 권장 기준을 초과합니다. 수익성 악화 위험이 높습니다.',
  },
];

const districtScores = [
  { district: '성동구', score: '83점', level: '높음' },
  { district: '마포구', score: '78점', level: '높음', active: true },
  { district: '강남구', score: '77점', level: '보통' },
];

const InputField = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold text-[#4e5968]">{label}</span>
    <input
      type="text"
      placeholder={placeholder}
      className="h-11 w-full rounded-md border border-[#e5e8eb] bg-white px-3 text-xs text-[#191f28] outline-none placeholder:text-[#b0b8c1] focus:border-blue-600"
    />
  </label>
);

const SliderFactor = ({ label }: { label: string }) => (
  <div className="rounded-lg bg-[#f7f8fa] px-7 py-5">
    <div className="mb-5 text-center text-sm font-extrabold text-[#191f28]">
      {label}
    </div>
    <div className="relative h-7">
      <div className="absolute left-0 right-0 top-3 h-2 rounded-full bg-[#e5e8eb]" />
      <div className="absolute left-0 top-3 h-2 w-[58%] rounded-full bg-blue-600" />
      <div className="absolute left-[55%] top-0 rounded-sm bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
        보통
      </div>
      <div className="absolute left-[58%] top-[7px] h-5 w-5 rounded-full border-2 border-white bg-blue-600 shadow" />
    </div>
    <div className="mt-2 flex justify-between text-[11px] font-medium text-[#8b95a1]">
      <span>하위</span>
      <span>상위</span>
    </div>
  </div>
);

const SurvivalCalculatorPage = () => {
  const isAuthenticated = getMockAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <header className="flex h-[54px] items-center justify-between border-b border-[#e5e8eb] bg-white px-5">
        <Link to="/home" className="flex items-center">
          <img src={SEEDPLUS} alt="SEED+" className="h-5" />
        </Link>
        <Link
          to="/store-builder"
          className="rounded-md bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
        >
          플랫폼으로 돌아가기
        </Link>
      </header>

      <main className="mx-auto grid max-w-[960px] grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-[1fr_1fr]">
        <section>
          <div className="mb-6">
            <h1 className="text-xl font-extrabold text-[#191f28]">
              생존율 계산기
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[#4e5968]">
              소상공인시장진흥공단 상권정보와 공공데이터 기반으로 창업 전 생존
              가능성을 점수화합니다.
              <br />
              6개 핵심 변수를 Survival Score로 환산해 1년/3년 생존 확률 구간을
              제시합니다.
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-[#191f28]">
              창업 정보 입력
            </h2>
            <p className="mt-1 text-xs text-[#4e5968]">
              사용자 입력 + 공공데이터 자동 반영
            </p>

            <div className="mt-5 rounded-md bg-blue-300 px-4 py-3 text-xs leading-relaxed text-blue-600">
              <strong>공공데이터 자동 연동</strong>
              <p className="mt-1">
                지역/업종 선택 시 소상공인시장진흥공단 상권정보, 서울시
                열린데이터광장, 국토교통부 실거래가 데이터가 자동 반영됩니다.
              </p>
            </div>

            <div className="mt-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#191f28]">
                  사용자입력
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4e5968]">
                      지역
                    </span>
                    <span className="rounded-full bg-blue-300 px-2 py-1 text-[10px] font-bold text-blue-600">
                      공공데이터 연동
                    </span>
                  </div>
                  <select
                    defaultValue="강남구"
                    className="h-11 w-full rounded-md border border-[#e5e8eb] bg-white px-3 text-xs text-[#191f28] outline-none focus:border-blue-600"
                  >
                    <option>강남구</option>
                  </select>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4e5968]">
                      업종 선택
                    </span>
                    <span className="rounded-full bg-blue-300 px-2 py-1 text-[10px] font-bold text-blue-600">
                      공공데이터 연동
                    </span>
                  </div>
                  <select
                    defaultValue="업종 선택"
                    className="h-11 w-full rounded-md border border-[#e5e8eb] bg-white px-3 text-xs text-[#191f28] outline-none focus:border-blue-600"
                  >
                    <option>업종 선택</option>
                  </select>
                </div>
                <InputField label="권리금(만)" placeholder="전환보증금 기준" />
                <InputField label="월임대료(만원)" placeholder="예)250" />
                <InputField label="보증금(만원)" placeholder="3000" />
                <div>
                  <span className="mb-2 block text-xs font-bold text-[#4e5968]">
                    창업형태
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="h-10 rounded-full bg-blue-600 px-4 text-xs font-bold text-white"
                    >
                      신규 창업
                    </button>
                    <button
                      type="button"
                      className="h-10 rounded-full border border-[#d8dde5] px-4 text-xs font-bold text-[#4e5968]"
                    >
                      양수 창업
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#e5e8eb] pt-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#191f28]">
                  공공데이터 기반 변수
                </h3>
                <span className="text-[11px] font-medium text-[#e5484d]">
                  지역, 업종 선택 시 자동 반영됩니다.
                </span>
              </div>
              <div className="space-y-4">
                {variableFactors.map((factor) => (
                  <SliderFactor key={factor} label={factor} />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="mt-5 h-12 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
            >
              생존율 계산하기
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-[#191f28]">
              데이터 출처 및 API 연동 현황
            </h2>
            <p className="mt-1 text-xs text-[#4e5968]">
              본 계산기에 반영된 공공데이터
            </p>
            <div className="mt-4 border-t border-[#e5e8eb] pt-4">
              <div className="flex flex-wrap gap-2">
                {dataBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-blue-300 px-3 py-1.5 text-[11px] font-bold text-blue-600"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-md border border-[#e5484d] bg-[#fffafa] px-4 py-3 text-xs leading-relaxed text-[#e5484d]">
              본 생존율은 공공데이터 기반 점수 모델로 산출된 참고용
              추정치입니다. 실제 생존율은 운영 역량, 마케팅, 경기 변동 등 다양한
              요인에 따라 달라질 수 있습니다.
            </div>

            <div className="mt-4 rounded-lg bg-blue-600 p-5 text-white">
              <div className="grid grid-cols-[1fr_128px] gap-4">
                <div>
                  <p className="text-sm font-bold">Survival Score</p>
                  <div className="mt-5 flex h-28 items-end justify-center">
                    <div className="relative h-24 w-40 overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-20 rounded-t-full border-[24px] border-b-0 border-white/35" />
                      <div className="absolute inset-x-0 bottom-0 h-20 rounded-t-full border-[24px] border-b-0 border-white" />
                      <div className="absolute inset-x-0 bottom-2 text-center">
                        <strong className="text-2xl font-extrabold">50</strong>
                        <span className="ml-1 text-sm font-bold">점</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-sm bg-white/20 px-4 py-3 text-right">
                    <p className="text-[11px] text-white/80">1년 생존 가능성</p>
                    <p className="mt-1 text-lg font-extrabold">40~50%</p>
                  </div>
                  <div className="rounded-sm bg-white/20 px-4 py-3 text-right">
                    <p className="text-[11px] text-white/80">3년 생존 가능성</p>
                    <p className="mt-1 text-lg font-extrabold">20~30%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-extrabold text-[#191f28]">
                Survival Score 분해
              </h3>
              <p className="mt-1 text-xs text-[#4e5968]">
                6개 변수별 점수 기여도
              </p>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                {scoreItems.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-[11px]">
                      <span className="font-bold text-[#191f28]">
                        {item.label}{' '}
                        <span className="font-medium text-[#8b95a1]">
                          {item.description}
                        </span>
                      </span>
                      <span
                        className={
                          item.positive ? 'text-blue-600' : 'text-[#e5484d]'
                        }
                      >
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e5e8eb]">
                      <div
                        className={`h-2 rounded-full ${
                          item.positive ? 'bg-blue-600' : 'bg-[#e5484d]'
                        }`}
                        style={{ width: item.positive ? '72%' : '86%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ['경쟁강도', '100%'],
                  ['임차부담도', '53%'],
                  ['상권활력도', '88점'],
                  ['안정성지수', '75점'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-blue-300 p-4">
                    <p className="text-xs font-bold text-[#4e5968]">{label}</p>
                    <p className="mt-2 text-right text-2xl font-extrabold text-blue-600">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-md border border-[#e5e8eb] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#191f28]">
                  위험 요인 TOP 3
                </h3>
                <span className="text-[11px] text-[#e5484d]">
                  생존율에 가장 큰 영향을 미치는 요인
                </span>
              </div>
              <div className="space-y-3">
                {riskItems.map((item) => (
                  <div key={item.title} className="rounded-md bg-[#f7f8fa] p-4">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-[#191f28]">
                        {item.title}
                      </strong>
                      <span className="text-xl font-extrabold text-[#e5484d]">
                        {item.score}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#4e5968]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#191f28]">
                유사 상권 대비 위치
              </h2>
              <span className="text-[11px] text-[#e5484d]">
                동일 업종 기준 상권별 생존율 비교
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {districtScores.map((district) => (
                <div
                  key={district.district}
                  className={`rounded-md border p-4 text-center ${
                    district.active
                      ? 'border-blue-600 bg-blue-300'
                      : 'border-transparent bg-blue-300/70'
                  }`}
                >
                  {district.active && (
                    <div className="mx-auto mb-1 w-fit rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold text-white">
                      내 상권
                    </div>
                  )}
                  <p className="text-xs font-bold text-[#4e5968]">
                    {district.district}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-blue-600">
                    {district.score}
                  </p>
                  <p className="mt-1 text-[11px] text-[#4e5968]">
                    {district.level}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="h-12 w-full rounded-md bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
          >
            다시 계산하기
          </button>
        </section>
      </main>
    </div>
  );
};

export default SurvivalCalculatorPage;
