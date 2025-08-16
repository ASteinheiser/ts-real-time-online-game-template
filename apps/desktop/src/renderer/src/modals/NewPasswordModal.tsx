import { Dialog, DialogContent, DialogTitle } from '@repo/ui';
import { NewPasswordForm } from '@repo/client-auth/forms';
import { APP_ROUTES } from '../router/constants';

interface NewPasswordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewPasswordModal = ({ isOpen, onOpenChange }: NewPasswordModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} aria-describedby={undefined}>
        <DialogTitle className="hidden">New Password</DialogTitle>

        <div className="py-6">
          <NewPasswordForm profileRedirectPath={APP_ROUTES.PROFILE} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
