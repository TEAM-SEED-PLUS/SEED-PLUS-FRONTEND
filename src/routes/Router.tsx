import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard/Dashboard';
import NotFoundPage from '@/pages/NotFoundPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
