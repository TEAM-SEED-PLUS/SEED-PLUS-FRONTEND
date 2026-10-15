import ConfirmModal from '@/components/ui/ConfirmModal';

interface LogoutConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmModal = ({
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) => (
  <ConfirmModal
    title="로그아웃"
    message="정말 로그아웃 하시겠습니까?"
    confirmLabel="로그아웃"
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
);

export default LogoutConfirmModal;
