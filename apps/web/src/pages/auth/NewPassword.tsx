import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label, LoadingSpinner, toast } from '@repo/ui';
import { useSession } from '../../router/SessionContext';

export const NewPassword = () => {
  const { newPassword } = useSession();
  const navigate = useNavigate();

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
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update password, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-4xl font-bold font-pixel text-center text-muted-light">New Password</h1>

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

          <Button type="submit" disabled={loading} className="w-full mt-6">
            {loading ? <LoadingSpinner /> : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};
