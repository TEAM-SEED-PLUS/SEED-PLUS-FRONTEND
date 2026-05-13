import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import {
  FeedPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  StoreBuilderPage,
} from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/store-builder" element={<StoreBuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
