import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Label, LoadingSpinner } from '@repo/ui';
import { useSession } from '../../router/SessionContext';

export const Signup = () => {
  const { signup } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold font-title">Signup</h1>

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

        <Label>Confirm Password</Label>
        <Input
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={({ target }) => setConfirmPassword(target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Signup'}
        </Button>

        <Button type="button">
          <Link to="/auth/login">Login</Link>
        </Button>
      </form>
    </div>
  );
};
