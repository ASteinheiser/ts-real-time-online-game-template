import { Dialog, DialogContent, DialogTitle } from '@repo/ui';
import { ProfileForm } from '@repo/client-auth/forms';
import { AUTH_ROUTES } from '@repo/client-auth/router';

interface ProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileModal = ({ isOpen, onOpenChange }: ProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} aria-describedby={undefined}>
        <DialogTitle className="hidden">Profile</DialogTitle>

        <div className="py-6">
          <ProfileForm logoutRedirectPath={AUTH_ROUTES.LOGIN} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
