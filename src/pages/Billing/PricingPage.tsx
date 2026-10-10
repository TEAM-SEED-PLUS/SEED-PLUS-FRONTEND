import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { AppFooter, HeaderUser } from '@/components/layout';
import {
  FREE_FEATURES,
  PRO_FEATURES,
  type CheckoutProductId,
} from '@/content/billingPlans';
import { useDocumentTitle } from '@/hooks';
import PlanCard from './PlanCard';

const buttonClass =
  'flex min-h-11 w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm leading-snug font-bold text-white transition hover:bg-blue-700 disabled:cursor-default disabled:hover:bg-blue-600';

/** 요금제/상품 소개 — FREE / PRO / (EXPERT 블러, 2차) */
const PricingPage = () => {
  useDocumentTitle('요금제 / 상품 소개');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // TODO(BE): 내 요금제 조회 API가 생기면 그 값으로 판단한다.
  // 결제 연동 전이라 현재 로그인 사용자는 모두 FREE다.
  const currentPlan = isAuthenticated ? 'FREE' : null;

  // 결제는 계정에 귀속되므로 비로그인 사용자는 로그인부터 한다.
  const goCheckout = (product: CheckoutProductId) => {
    navigate(
      isAuthenticated ? `/pricing/checkout?product=${product}` : '/login'
    );
  };

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

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <PlanCard
            title="FREE 요금제"
            price="0원"
            priceUnit="/ 월"
            features={FREE_FEATURES}
            isCurrent={currentPlan === 'FREE'}
            footer={
              currentPlan === 'FREE' && (
                <button type="button" disabled className={buttonClass}>
                  구독 중인 요금제
                </button>
              )
            }
          />
          <PlanCard
            title="PRO 요금제"
            price="5,900원"
            priceUnit="/ 월"
            priceNote="연간 결제시 59,000원 / 16% 할인"
            features={PRO_FEATURES}
            footer={
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => goCheckout('pro-monthly')}
                  className={buttonClass}
                >
                  PRO 요금제 월간 구독하러 가기
                </button>
                <button
                  type="button"
                  onClick={() => goCheckout('pro-yearly')}
                  className={buttonClass}
                >
                  PRO 요금제 연간 구독하러 가기
                </button>
              </div>
            }
          />
          {/* EXPERT는 2차 구현 — 판매하지 않으므로 실제 가격·혜택 대신 자리만 블러로 둔다 */}
          <PlanCard
            title="EXPERT 요금제"
            price="준비 중"
            features={['2차 오픈 예정']}
            isBlurred
            footer={<div className="h-11 rounded-md bg-blue-600" aria-hidden />}
          />
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default PricingPage;
