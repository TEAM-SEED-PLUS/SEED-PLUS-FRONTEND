import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { FeedPage, HomePage, LoginPage, NotFoundPage, UserPage } from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/management" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
