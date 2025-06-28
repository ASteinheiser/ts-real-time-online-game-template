import {
  Button,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui';

interface OptionsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OptionsModal = ({ isOpen, onOpenChange }: OptionsModalProps) => {
  // this is how to send IPC messages to the main process
  // const ipcHandle = () => {
  //   window.electron.ipcRenderer.send('ping');
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Options</DialogTitle>
          <DialogDescription>Adjust settings for audio, video, etc.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Audio
          </Label>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="secondary">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
