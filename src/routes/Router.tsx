import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard/Dashboard';
import NotFoundPage from '@/pages/NotFoundPage';
import MlsPage from '@/pages/MLS/MlsPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/management" element={<MlsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
