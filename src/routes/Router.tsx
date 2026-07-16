import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleAnalyticsTracker } from '@/components/analytics';
import {
  FeedPage,
  LandingPage,
  LoginPage,
  MyPage,
  NotFoundPage,
  SignupPage,
  StoreBuilderPage,
} from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <GoogleAnalyticsTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/store-builder" element={<StoreBuilderPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
