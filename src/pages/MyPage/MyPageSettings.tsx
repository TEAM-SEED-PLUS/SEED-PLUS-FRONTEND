import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { HeaderUser, LogoutConfirmModal } from '@/components/layout';
import { AccountActions, NotificationSettings } from '@/components/mypage';
import { useDocumentTitle } from '@/hooks';

const MyPageSettings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, status, logout } = useAuth();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  useDocumentTitle('설정');

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-500 text-sm font-medium text-gray-46">
        인증 상태를 확인하고 있습니다.
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const confirmLogout = async () => {
    setIsLogoutConfirmOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-500">
      <HeaderUser />

      <main className="mx-auto max-w-[640px] px-5 pb-12 pt-[calc(var(--header-height)+20px)] lg:px-8 lg:pt-[calc(var(--header-height)+32px)]">
        <div className="mb-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/mypage')}
            aria-label="마이페이지로 돌아가기"
            className="text-xl font-bold text-gray-46 transition hover:text-[#191f28]"
          >
            ‹
          </button>
          <h1 className="text-xl font-extrabold text-[#191f28]">설정</h1>
        </div>

        {FEATURE_FLAGS.NOTIFICATION_SETTINGS && <NotificationSettings />}

        <AccountActions
          className={FEATURE_FLAGS.NOTIFICATION_SETTINGS ? 'mt-8' : ''}
          onLogout={() => setIsLogoutConfirmOpen(true)}
          onWithdraw={() => setIsWithdrawOpen(true)}
        />
      </main>

      {isLogoutConfirmOpen && (
        <LogoutConfirmModal
          onConfirm={confirmLogout}
          onCancel={() => setIsLogoutConfirmOpen(false)}
        />
      )}

      {isWithdrawOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          role="dialog"
          aria-modal="true"
          aria-label="회원탈퇴"
          onClick={() => setIsWithdrawOpen(false)}
        >
          <section
            className="w-full max-w-[360px] rounded-lg bg-white p-6 shadow-[0_18px_60px_rgba(25,31,40,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-[#191f28]">회원탈퇴</h2>
            <p className="mt-3 text-sm leading-relaxed font-medium text-[#4e5968]">
              회원탈퇴 기능은 현재 준비 중입니다. 곧 제공될 예정입니다.
            </p>
            <button
              type="button"
              onClick={() => setIsWithdrawOpen(false)}
              className="mt-6 h-11 w-full rounded-md bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              확인
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default MyPageSettings;
