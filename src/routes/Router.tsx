import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard, FeedPage, NotFoundPage, UserPage } from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/management" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
