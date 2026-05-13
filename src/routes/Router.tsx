import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import {
  FeedPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  StoreBuilderPage,
  SurvivalCalculatorPage,
} from '@/pages';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/store-builder" element={<StoreBuilderPage />} />
        <Route
          path="/store-builder/survival-calculator"
          element={<SurvivalCalculatorPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
