import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Label, LoadingSpinner, toast } from '@repo/ui';
import { useSession } from '../../router/SessionContext';

export const Login = () => {
  const { login } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      toast.error('Failed to login, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-2xl font-bold font-title text-center">Log In</h1>

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
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Log In'}
            </Button>

            <div className="flex flex-row gap-4">
              <Button asChild variant="ghost" className="flex-1">
                <Link to="/auth/forgot-password">Forgot Password</Link>
              </Button>
              <Button asChild variant="secondary" className="flex-1">
                <Link to="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
