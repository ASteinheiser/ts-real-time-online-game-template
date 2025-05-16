import { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui';

interface StartGameFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (args: { username: string }) => void;
}

export const StartGameForm = ({ isOpen, onOpenChange, onSubmit }: StartGameFormProps) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    const trimmedUsername = username.trim();
    if (trimmedUsername === '') return;

    onSubmit({ username: trimmedUsername });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a game</DialogTitle>
          <DialogDescription>Enter your username to join a game</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>
            <Input
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Join game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
