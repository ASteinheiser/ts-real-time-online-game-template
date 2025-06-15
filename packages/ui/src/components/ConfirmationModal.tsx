import { Button } from './Button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from './Dialog';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm }: ConfirmationModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleConfirm = async () => {
    onClose();
    await onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>
          <h1 className="text-4xl font-bold font-pixel text-center text-muted-foreground">
            Are you sure?
          </h1>
        </DialogTitle>
        <DialogFooter>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full">
            <Button onClick={onClose} variant="secondary" size="lg" className="w-full">
              Cancel
            </Button>
            <Button onClick={handleConfirm} size="lg" className="w-full">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
