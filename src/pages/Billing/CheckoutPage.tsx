import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/auth';
import { AppFooter, AuthCheckingScreen, HeaderUser } from '@/components/layout';
import {
  CHECKOUT_PRODUCTS,
  PAYMENT_METHODS,
  isCheckoutProductId,
} from '@/content/billingPlans';
import { useDocumentTitle } from '@/hooks';
import PlanCard from './PlanCard';

type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/**
 * 요금제 선택 후 결제 화면 — 왼쪽 상품 요약, 오른쪽 결제방법.
 * PG 연동 전이라 [확인]은 준비 중 안내만 띄운다.
 * TODO(BE/PG): 주문 생성 → 결제창 → 승인 결과 확인 흐름으로 교체.
 */
const CheckoutPage = () => {
  useDocumentTitle('결제');
  const { status, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get('product');
  const [method, setMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  if (status === 'loading') {
    return <AuthCheckingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isCheckoutProductId(productParam)) {
    return <Navigate to="/pricing" replace />;
  }

  const product = CHECKOUT_PRODUCTS[productParam];

  return (
    <div className="flex min-h-screen flex-col bg-gray-500">
      <HeaderUser />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 pb-16 pt-[calc(var(--header-height)+28px)] lg:px-8">
        <h1 className="text-2xl font-extrabold text-[#191f28] md:text-4xl">
          요금제 / 상품 소개
        </h1>
        <p className="mt-2 text-sm text-[#4e5968]">
          SEED+의 요금제와 상품을 확인해보세요!
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PlanCard
            title={product.title}
            price={product.price}
            priceUnit={product.priceUnit}
            priceNote={product.priceNote}
            features={product.features}
          />

          <section className="flex flex-col rounded-lg bg-white p-6 md:p-8">
            <h2 className="text-center text-lg font-extrabold text-[#191f28] md:text-xl">
              결제방법
            </h2>
            <fieldset className="mt-8 flex-1">
              <legend className="sr-only">결제방법 선택</legend>
              <div className="space-y-5">
                {PAYMENT_METHODS.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2 text-lg font-medium text-[#191f28] md:text-2xl"
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={item}
                      checked={method === item}
                      onChange={() => setMethod(item)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              onClick={() => setIsNoticeOpen(true)}
              className="mt-8 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700"
            >
              확인
            </button>
          </section>
        </div>
      </main>
      <AppFooter />

      {isNoticeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"
          role="dialog"
          aria-modal="true"
          aria-label="결제 준비 중 안내"
          onClick={() => setIsNoticeOpen(false)}
        >
          <section
            className="w-full max-w-[400px] rounded-lg bg-white p-7 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="border-b border-[#e5e8eb] pb-4 text-xl font-extrabold text-[#191f28]">
              안내
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#333d4b]">
              결제 기능은 준비 중입니다.
              <br />
              오픈 시 공지사항으로 안내드리겠습니다.
            </p>
            <button
              type="button"
              onClick={() => setIsNoticeOpen(false)}
              className="mt-6 h-12 w-full rounded-md bg-blue-600 text-base font-bold text-white transition hover:bg-blue-700"
            >
              확인
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
