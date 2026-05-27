import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import {
  FeedPage,
  LoginPage,
  NotFoundPage,
  SignupPage,
  StoreBuilderPage,
} from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/store-builder" replace />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/store-builder" element={<StoreBuilderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
