import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
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
  const { session, profile, logout } = useSession();

  const [userName, setUserName] = useState(profile?.userName ?? '');
  const [email, setEmail] = useState(session?.user.email ?? '');

  const { userNameExists, loading: userExistsLoading } = useUserNameExists(userName);

  const [updateUserName, { loading: updateUserNameLoading }] = useMutation<
    Web_UpdateUserNameMutation,
    Web_UpdateUserNameMutationVariables
  >(UPDATE_USER_NAME);

  const loading = userExistsLoading || updateUserNameLoading;
  const isUserNameAvailable = userNameExists !== undefined && !userNameExists;
  const isUserNameChanged = !!userName && userName !== profile?.userName;
  const isEmailConfirmed = Boolean(session?.user.email_confirmed_at);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-4xl font-bold font-pixel text-center text-muted-light">Your Profile</h1>

        <form onSubmit={handleSubmit}>
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
                className={isEmailConfirmed ? 'text-green-500' : 'text-gray-500'}
              />
            </div>

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
                  !loading && (isUserNameAvailable || !isUserNameChanged)
                    ? 'text-green-500'
                    : 'text-gray-500'
                }
              />
            </div>

            <Button type="submit" disabled={loading || !isUserNameChanged} className="mt-6">
              {loading ? <LoadingSpinner /> : 'Save'}
            </Button>
          </div>
        </form>

        <Button onClick={handleLogout} className="mt-4" variant="secondary">
          Logout
        </Button>
      </div>
    </div>
  );
};
