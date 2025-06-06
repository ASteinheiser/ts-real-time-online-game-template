import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';
import { Button, Input, Label, LoadingSpinner, toast } from '@repo/ui';
import { CheckMark } from '@repo/ui/icons';
import { useSession } from '../../router/SessionContext';
import { useUserNameExists } from '../../hooks/useUserNameExists';
import { Web_UpdateUserNameMutation, Web_UpdateUserNameMutationVariables } from '../../graphql';

const UPDATE_USER_NAME = gql`
  mutation Web_UpdateUserName($userName: String!) {
    updateProfile(userName: $userName) {
      userName
    }
  }
`;

export const Profile = () => {
  const navigate = useNavigate();
  const { session, profile, logout, changeEmail, newPassword } = useSession();

  const [userName, setUserName] = useState(profile?.userName ?? '');
  const [email, setEmail] = useState(session?.user.email ?? '');
  const [emailLoading, setEmailLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { userNameExists, loading: userExistsLoading } = useUserNameExists(userName);

  const [updateUserName, { loading: updateUserNameLoading }] = useMutation<
    Web_UpdateUserNameMutation,
    Web_UpdateUserNameMutationVariables
  >(UPDATE_USER_NAME);

  const userNameLoading = userExistsLoading || updateUserNameLoading;
  const isUserNameAvailable = userNameExists !== undefined && !userNameExists;
  const isUserNameChanged = !!userName && userName !== profile?.userName;
  const isEmailConfirmed = Boolean(session?.user.email_confirmed_at);
  const isEmailChanged = !!email && email !== session?.user.email;
  const isPasswordChanged = !!password && password === confirmPassword;

  const handleUpdateUserName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isUserNameChanged) return;

    if (!userName) {
      toast.error('Please enter a username');
      return;
    }
    if (!isUserNameAvailable) {
      toast.error('Username is already taken');
      return;
    }

    try {
      await updateUserName({
        variables: { userName },
        context: { headers: { authorization: session?.access_token } },
      });
      toast.success('Username updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update username, please try again');
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEmailChanged) return;

    if (!email || !isEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await changeEmail(email);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Email updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update email, please try again');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordChanged) return;

    if (!password || !confirmPassword) {
      toast.error('Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
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
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-4xl font-bold font-pixel text-center text-muted-light">Your Profile</h1>

        <form onSubmit={handleUpdateUserName}>
          <div className="flex flex-col gap-2">
            <Label className="text-md">Username</Label>
            <div className="flex flex-row items-center gap-4">
              <Input
                name="userName"
                value={userName}
                onChange={({ target }) => setUserName(target.value)}
              />
              <CheckMark
                size={24}
                className={
                  !userNameLoading && (isUserNameAvailable || !isUserNameChanged)
                    ? 'text-green-500'
                    : 'text-gray-500'
                }
              />
            </div>

            <Button type="submit" disabled={userNameLoading || !isUserNameChanged} className="mt-6">
              {userNameLoading ? <LoadingSpinner /> : 'Update Username'}
            </Button>
          </div>
        </form>

        <form onSubmit={handleUpdateEmail}>
          <div className="flex flex-col gap-2">
            <Label className="text-md">Email</Label>
            <div className="flex flex-row items-center gap-4">
              <Input
                name="email"
                type="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
              />
              <CheckMark
                size={24}
                className={!emailLoading && isEmailConfirmed ? 'text-green-500' : 'text-gray-500'}
              />
            </div>

            <Button type="submit" disabled={emailLoading || !isEmailChanged} className="mt-6">
              {emailLoading ? <LoadingSpinner /> : 'Update Email'}
            </Button>
          </div>
        </form>

        <form onSubmit={handleUpdatePassword}>
          <div className="flex flex-col gap-2">
            <Label className="text-md">New Password</Label>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            <Label className="text-md">Confirm Password</Label>
            <Input
              name="confirm password"
              type="password"
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
            />

            <Button type="submit" disabled={passwordLoading || !isPasswordChanged} className="mt-6">
              {passwordLoading ? <LoadingSpinner /> : 'Update Password'}
            </Button>
          </div>
        </form>

        <Button onClick={handleLogout} className="mt-6" variant="secondary">
          Logout
        </Button>
      </div>
    </div>
  );
};
