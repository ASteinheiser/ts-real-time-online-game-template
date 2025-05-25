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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold font-title">Login</h1>

      <form onSubmit={handleSubmit}>
        <Label>Email</Label>
        <Input name="email" value={email} onChange={({ target }) => setEmail(target.value)} />

        <Label>Password</Label>
        <Input
          name="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Login'}
        </Button>

        <Button type="button">
          <Link to="/auth/signup">Signup</Link>
        </Button>
      </form>
    </div>
  );
};
