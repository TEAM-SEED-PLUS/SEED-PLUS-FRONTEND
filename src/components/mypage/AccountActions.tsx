interface AccountActionsProps {
  onLogout: () => void;
  onWithdraw: () => void;
  className?: string;
}

const AccountActions = ({
  onLogout,
  onWithdraw,
  className = '',
}: AccountActionsProps) => (
  <div className={`space-y-3 ${className}`}>
    <button
      type="button"
      onClick={onLogout}
      className="h-12 w-full rounded-lg bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
    >
      로그아웃
    </button>
    <button
      type="button"
      onClick={onWithdraw}
      className="h-12 w-full rounded-lg bg-[#e5484d] text-sm font-extrabold text-white transition hover:bg-[#d13438]"
    >
      회원탈퇴
    </button>
  </div>
);

export default AccountActions;
