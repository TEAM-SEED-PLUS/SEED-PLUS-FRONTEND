import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleAnalyticsTracker } from '@/components/analytics';
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
} from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <GoogleAnalyticsTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        {/* 약관·개인정보처리방침은 비회원도 볼 수 있어야 한다(외부 심사·고지 의무) */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/store-builder" element={<StoreBuilderPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/settings" element={<MyPageSettings />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
