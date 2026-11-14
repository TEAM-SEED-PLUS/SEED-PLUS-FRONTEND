import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleAnalyticsTracker } from '@/components/analytics';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import {
  FeedPage,
  HomePage,
  LandingPage,
  LoginPage,
  PrivacyPolicyPage,
  TermsPage,
  MyPage,
  MyPageSettings,
  NotFoundPage,
  PasswordResetPage,
  SignupPage,
  StoreBuilderPage,
  WeatherPage,
  PricingPage,
  CheckoutPage,
  PaymentHistoryPage,
  NoticeListPage,
  NoticeDetailPage,
  FaqPage,
  ContactPage,
  CompanyPage,
} from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <GoogleAnalyticsTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* 피드는 운영 비노출 — 플래그가 꺼져 있으면 주소로 들어와도 404로 둔다 */}
        {FEATURE_FLAGS.FEED && <Route path="/feed" element={<FeedPage />} />}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        {/* 약관·개인정보처리방침은 비회원도 볼 수 있어야 한다(외부 심사·고지 의무) */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        {/* 고객 지원 페이지는 비회원도 볼 수 있다 */}
        <Route path="/notice" element={<NoticeListPage />} />
        <Route path="/notice/:noticeId" element={<NoticeDetailPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/store-builder" element={<StoreBuilderPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/settings" element={<MyPageSettings />} />
        {/* BM 1차 — 요금제 소개는 비회원도 볼 수 있고, 결제는 로그인 후.
            권한·결제 API 전이라 플래그가 꺼져 있으면 주소로 들어와도 404로 둔다. */}
        {FEATURE_FLAGS.BM_PHASE1 && (
          <>
            <Route path="/mypage/payments" element={<PaymentHistoryPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/pricing/checkout" element={<CheckoutPage />} />
          </>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
