import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { AppFooter, AuthCheckingScreen, HeaderUser } from '@/components/layout';
import { useDocumentTitle } from '@/hooks';

/** 결제 내역 한 줄 (Figma '결제내역' 표 컬럼) */
type PaymentRecord = {
  id: string;
  productName: string;
  paymentType: string;
  amount: string;
  status: string;
  paidAt: string;
  period: string;
};

const COLUMNS = [
  '상품명',
  '결제 유형',
  '결제 금액',
  '상태',
  '결제일',
  '이용기간',
];

// TODO(BE): 결제내역 조회 API 연동. 결제 연동 전이라 실제 결제 기록이 없다.
const payments: PaymentRecord[] = [];

/** 내 결제 현황 */
const PaymentHistoryPage = () => {
  useDocumentTitle('내 결제 현황');
  const { status, isAuthenticated } = useAuth();

  if (status === 'loading') {
    return <AuthCheckingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-500">
      <HeaderUser />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-3 pb-16 pt-[calc(var(--header-height)+16px)] md:px-5 md:pt-[calc(var(--header-height)+28px)] lg:px-8">
        <h1 className="hidden text-4xl font-extrabold text-[#191f28] md:block">
          내 결제 현황
        </h1>

        <section className="mt-0 overflow-x-auto rounded-lg border border-[#e5e8eb] bg-white p-3 md:mt-8 md:p-6">
          <table className="w-full min-w-[400px] border-separate border-spacing-y-4 text-left text-xs md:text-base">
            <thead>
              <tr className="bg-[#f7f8fa]">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="whitespace-nowrap px-3 py-3 font-bold text-[#191f28]"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-3 py-16 text-center text-sm text-gray-46"
                  >
                    결제 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="text-[#191f28]">
                    <td className="rounded-l-md border-y border-l border-[#e5e8eb] px-3 py-3">
                      {payment.productName}
                    </td>
                    <td className="border-y border-[#e5e8eb] px-3 py-3">
                      {payment.paymentType}
                    </td>
                    <td className="border-y border-[#e5e8eb] px-3 py-3">
                      {payment.amount}
                    </td>
                    <td className="border-y border-[#e5e8eb] px-3 py-3">
                      {payment.status}
                    </td>
                    <td className="border-y border-[#e5e8eb] px-3 py-3">
                      {payment.paidAt}
                    </td>
                    <td className="rounded-r-md border-y border-r border-[#e5e8eb] px-3 py-3">
                      {payment.period}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
      <AppFooter />
    </div>
  );
};

export default PaymentHistoryPage;
