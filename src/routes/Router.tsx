import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { LoginPage, NotFoundPage, StoreBuilderPage } from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/store-builder" element={<StoreBuilderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
