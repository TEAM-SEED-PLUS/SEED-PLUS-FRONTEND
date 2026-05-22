const days = Array.from({ length: 28 }, (_, index) => index + 1);

const events = [
  {
    badge: 'D-Day',
    title: '한국은행 기준금리 결정',
    date: '2월 28일',
    color: 'border-l-[#e55757] bg-gray-500 text-[#e55757]',
  },
  {
    badge: 'D-5',
    title: '서울시 상권 활성화 지원금 신청',
    date: '3월 5일',
    color: 'border-l-[#f2992e] bg-gray-500 text-[#f2992e]',
  },
  {
    badge: 'D-10',
    title: '상업용 부동산 실거래가 공시',
    date: '3월 10일',
    color: 'border-l-blue-600 bg-gray-500 text-blue-600',
  },
  {
    badge: 'D-15',
    title: '소상공인 정책자금 설명회',
    date: '3월 15일',
    color: 'border-l-blue-600 bg-gray-500 text-blue-600',
  },
];

const EventCalendar = () => {
  return (
    <section className="rounded-xl border border-[#e5e8eb] bg-white">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-extrabold text-[#191f28]">
          🗓️ 부동산 이벤트 캘린더
        </h2>
        <div className="flex items-center gap-4 text-base font-extrabold">
          <button>‹</button>
          <span>2026년 2월</span>
          <button>›</button>
        </div>
      </div>

      <div className="px-6 pb-5">
        <div className="grid grid-cols-7 gap-y-4 text-center text-sm font-bold text-gray-46">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day}>{day}</div>
          ))}
          {days.map((day) => (
            <div key={day} className="flex justify-center">
              <span
                className={`flex h-8 w-10 items-center justify-center rounded-lg font-bold ${
                  day === 28 ? 'bg-blue-600 text-white' : 'text-[#191f28]'
                }`}
              >
                {day}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {events.map((event) => (
            <div
              key={event.title}
              className={`rounded-lg border-l-4 px-4 py-3 ${event.color}`}
            >
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold">
                  {event.badge}
                </span>
                <div>
                  <div className="text-sm font-extrabold text-[#191f28]">
                    {event.title}
                  </div>
                  <div className="mt-1 text-xs font-bold text-gray-46">
                    {event.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;
