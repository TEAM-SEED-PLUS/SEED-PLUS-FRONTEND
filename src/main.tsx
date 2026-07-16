import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Router from '@/routes/Router';
import { AuthProvider } from '@/auth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>
);
