import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Input, Label, LoadingSpinner, toast } from '@repo/ui';
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
  const { profile } = useSession();

  const [userName, setUserName] = useState(profile?.userName ?? '');

  const { userNameExists, loading: userExistsLoading } = useUserNameExists(userName);

  const [updateUserName, { loading: updateUserNameLoading }] = useMutation<
    Web_UpdateUserNameMutation,
    Web_UpdateUserNameMutationVariables
  >(UPDATE_USER_NAME);

  const loading = userExistsLoading || updateUserNameLoading;
  const isUserNameAvailable = userNameExists !== undefined && !userNameExists;
  const isUserNameChanged = !!userName && userName !== profile?.userName;

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
      await updateUserName({ variables: { userName } });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update username, please try again');
    }
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-3xl font-bold font-label text-center">Your Profile</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="text-md">Username</Label>
            <Input
              name="userName"
              value={userName}
              onChange={({ target }) => setUserName(target.value)}
            />

            {isUserNameChanged && !isUserNameAvailable && !loading && (
              <span className="text-red-500 text-sm">Username is already taken</span>
            )}

            <Button type="submit" disabled={loading || !isUserNameChanged} className="mt-4">
              {loading ? <LoadingSpinner /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
