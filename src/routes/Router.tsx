import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleAnalyticsTracker } from '@/components/analytics';
import {
  FeedPage,
  HomePage,
  LandingPage,
  LoginPage,
  MyPage,
  MyPageSettings,
  NotFoundPage,
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
