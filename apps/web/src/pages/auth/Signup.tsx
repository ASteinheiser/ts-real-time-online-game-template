import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Label, LoadingSpinner, toast } from '@repo/ui';
import { useSession } from '../../router/SessionContext';

export const Signup = () => {
  const { signup } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
    } catch (error) {
      console.error(error);
      toast.error('Failed to signup, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-3xl font-bold font-pixel text-center">Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="text-md">Email</Label>
            <Input name="email" value={email} onChange={({ target }) => setEmail(target.value)} />

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

          <div className="flex flex-col gap-4 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Sign Up'}
            </Button>

            <Button asChild variant="secondary" className="flex-1">
              <Link to="/auth/login">Log In</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
