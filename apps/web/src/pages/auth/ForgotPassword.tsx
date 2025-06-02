import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isEmail } from 'validator';
import { Button, Input, Label, LoadingSpinner, toast } from '@repo/ui';
import { useSession } from '../../router/SessionContext';

export const ForgotPassword = () => {
  const { forgotPassword } = useSession();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    if (!isEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success('Password reset email sent! Check your inbox');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send reset email, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-4xl font-bold font-pixel text-center text-muted-light">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="text-md">Email</Label>
            <Input name="email" value={email} onChange={({ target }) => setEmail(target.value)} />
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Send Reset Link'}
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
