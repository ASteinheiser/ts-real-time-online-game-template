import { useState } from 'react';
import { Button, Input, Label, toast } from '@repo/ui';
import { useSession } from '../provider/SessionContext';

export const NewPasswordForm = () => {
  const { newPassword } = useSession();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await newPassword(password);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Password updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update password, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
      <h1 className="text-4xl font-bold font-pixel text-center text-muted-foreground">New Password</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label className="text-md">Password</Label>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          <Label className="text-md">Confirm Password</Label>
          <Input
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
          />
        </div>

        <Button type="submit" loading={loading} className="w-full mt-6">
          Update Password
        </Button>
      </form>
    </div>
  );
};
