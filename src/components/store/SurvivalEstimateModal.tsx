interface SurvivalEstimateModalProps {
  onClose: () => void;
}

const inputClass =
  'h-11 w-full rounded-md border border-[#d8dde5] bg-white px-3 text-sm text-[#191f28] outline-none placeholder:text-[#8b95a1] focus:border-blue-600';

const labelClass = 'mb-2 block text-sm font-medium text-[#333d4b]';

const dataBadges = [
  '소상공인시장진흥공단',
  '서울시 열린데이터',
  '국토교통부 실거래가',
  '카드 매출 데이터',
  '유동인구 데이터',
];

const scoreRows = [
  { label: '매출 안정성', score: '+20', positive: true },
  { label: '상권 성장성', score: '+9', positive: true },
  { label: '경쟁 강도', score: '-20', positive: false },
  { label: '공실 리스크', score: '+0', positive: true },
  { label: '유동인구', score: '-20', positive: false },
  { label: '입차 부담', score: '+0', positive: true },
];

const riskItems = [
  '동일업종 과밀 경쟁',
  '임차 부담 과중',
  '유동인구 대비 낮은 전환율',
];

const SurvivalEstimateModal = ({ onClose }: SurvivalEstimateModalProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-30 flex items-start justify-center overflow-y-auto bg-[#f5f6f8] px-8 py-6">
      <section className="relative grid w-full max-w-[1120px] grid-cols-1 gap-8 lg:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-[#6b7684] shadow-sm transition hover:bg-[#f2f4f6] hover:text-[#191f28]"
        >
          ×
        </button>

        <div className="rounded-lg border border-[#d8dde5] bg-white p-6">
          <div className="border-b border-[#e5e8eb] pb-4">
            <h2 className="text-xl font-bold text-[#191f28]">
              내 상가 생존율 추정
            </h2>
            <p className="mt-2 text-xs font-medium text-[#4e5968]">
              업종과 지역 정보를 입력하면 예상 생존율과 위험 요인을 계산합니다.
            </p>
          </div>

          <form className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>지역선택</span>
              <select defaultValue="강남구" className={inputClass}>
                <option>강남구</option>
                <option>마포구</option>
                <option>성동구</option>
                <option>종로구</option>
                <option>용산구</option>
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>업종선택</span>
              <select defaultValue="음식점" className={inputClass}>
                <option>음식점</option>
                <option>카페/음료</option>
                <option>소매/판매</option>
                <option>미용/뷰티</option>
                <option>헬스/스포츠</option>
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>권리금(만원)</span>
              <input
                type="number"
                placeholder="예) 3000"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>월 임대료(만원)</span>
              <input
                type="number"
                placeholder="예) 250"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>보증금(만원)</span>
              <input
                type="number"
                placeholder="예) 3000"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>창업형태</span>
              <select defaultValue="신규 창업" className={inputClass}>
                <option>신규 창업</option>
                <option>양수 창업</option>
              </select>
            </label>

            <div className="rounded-md bg-[#f7f8fa] p-4 md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#191f28]">
                  공공데이터 기반 변수
                </span>
                <span className="text-xs font-medium text-[#e5484d]">
                  지역·업종 선택 시 자동 반영
                </span>
              </div>
              <div className="space-y-3">
                {[
                  '상권 평균 매출',
                  '최근 매출 성장률',
                  '동일업종 점포 밀도',
                ].map((label) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs text-[#4e5968]">
                      <span>{label}</span>
                      <span>보통</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e5e8eb]">
                      <div className="h-2 w-[58%] rounded-full bg-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="mt-1 h-12 rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700 md:col-span-2"
            >
              생존율 추정
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-[#d8dde5] bg-white p-6">
          <div className="flex flex-wrap gap-2 border-b border-[#e5e8eb] pb-4">
            {dataBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-blue-300 px-3 py-1.5 text-[11px] font-bold text-blue-600"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-[#e5484d] bg-[#fffafa] px-3 py-3 text-xs font-medium leading-relaxed text-[#e5484d]">
            본 생존율은 공공데이터 기반 점수 모델로 산출된 참고용 추정치입니다.
            실제 생존율은 운영 역량과 시장 상황에 따라 달라질 수 있습니다.
          </div>

          <div className="mt-4 rounded-lg bg-blue-600 p-5 text-white">
            <p className="text-sm font-bold">Survival Score</p>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <strong className="text-4xl font-extrabold">50</strong>
                <span className="ml-1 text-sm font-bold">점</span>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-sm font-bold">1년 생존 가능성 40~50%</p>
                <p className="text-sm font-bold">3년 생존 가능성 20~30%</p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-extrabold text-[#191f28]">
              Survival Score 분해
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              {scoreRows.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="font-bold text-[#191f28]">
                      {item.label}
                    </span>
                    <span
                      className={
                        item.positive ? 'text-blue-600' : 'text-[#e5484d]'
                      }
                    >
                      {item.score}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#e5e8eb]">
                    <div
                      className={`h-2 rounded-full ${
                        item.positive ? 'bg-blue-600' : 'bg-[#e5484d]'
                      }`}
                      style={{ width: item.positive ? '66%' : '84%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-md border border-[#e5e8eb] p-4">
            <h3 className="text-sm font-extrabold text-[#191f28]">
              위험 요인 TOP 3
            </h3>
            <div className="mt-3 space-y-2">
              {riskItems.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-md bg-[#f7f8fa] px-4 py-3"
                >
                  <span className="text-sm font-bold text-[#191f28]">
                    {index + 1}위 {item}
                  </span>
                  <span className="text-lg font-extrabold text-[#e5484d]">
                    -20점
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="mt-4 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700"
          >
            내 상가 목록에 저장하기
          </button>
        </div>
      </section>
    </div>
  );
};

export default SurvivalEstimateModal;
