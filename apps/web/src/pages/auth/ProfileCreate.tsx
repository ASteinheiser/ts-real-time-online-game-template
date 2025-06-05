import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label, LoadingSpinner, toast } from '@repo/ui';
import { Web_CreateProfileMutation, Web_CreateProfileMutationVariables } from '../../graphql';
import { useUserNameExists } from '../../hooks/useUserNameExists';
import { useSession } from '../../router/SessionContext';

const CREATE_PROFILE = gql`
  mutation Web_CreateProfile($userName: String!) {
    createProfile(userName: $userName) {
      userName
    }
  }
`;

export const ProfileCreate = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  const [userName, setUserName] = useState('');

  const { userNameExists, loading: userExistsLoading } = useUserNameExists(userName);

  const [createProfile, { loading: createProfileLoading }] = useMutation<
    Web_CreateProfileMutation,
    Web_CreateProfileMutationVariables
  >(CREATE_PROFILE);

  const isUserNameAvailable = userNameExists !== undefined && !userNameExists;
  const loading = userExistsLoading || createProfileLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName) {
      toast.error('Please enter a username');
      return;
    }
    if (!isUserNameAvailable) {
      toast.error('Username is already taken');
      return;
    }

    try {
      await createProfile({
        variables: { userName },
        context: { headers: { authorization: session?.access_token } },
      });
      toast.success('Profile created successfully');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create profile, please try again');
    }
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-4xl font-bold font-pixel text-center text-muted-light">
          Create Your Profile
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="text-md">Username</Label>
            <Input
              name="userName"
              value={userName}
              onChange={({ target }) => setUserName(target.value)}
            />

            {userName && !isUserNameAvailable && !loading && (
              <span className="text-red-500 text-sm">Username is already taken</span>
            )}

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? <LoadingSpinner /> : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
