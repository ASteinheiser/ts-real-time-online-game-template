import { useState } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { useSession } from '@repo/client-auth/provider';
import { Button, Input, Label, toast } from '@repo/ui';
import { CheckMark } from '@repo/ui/icons';
import { Web_CreateProfileMutation, Web_CreateProfileMutationVariables } from '../../graphql';
import { useUserNameExists } from '../../hooks/useUserNameExists';

const CREATE_PROFILE = gql`
  mutation Web_CreateProfile($userName: String!) {
    createProfile(userName: $userName) {
      userName
    }
  }
`;

export const ProfileCreate = () => {
  const client = useApolloClient();
  const { session, refetchProfile } = useSession();

  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const { userNameExists, isTyping, loading: userExistsLoading } = useUserNameExists(userName);
  const isUserNameAvailable = userNameExists === false;

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

    setLoading(true);
    try {
      await client.mutate<Web_CreateProfileMutation, Web_CreateProfileMutationVariables>({
        mutation: CREATE_PROFILE,
        variables: { userName },
        context: { headers: { authorization: session?.access_token } },
      });
      await refetchProfile();
      toast.success('Profile created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create profile, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <h1 className="text-4xl font-bold font-pixel text-center text-muted-foreground">
          Create Your Profile
        </h1>

        <form onSubmit={handleSubmit}>
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
                  !isTyping && !userExistsLoading && userName && isUserNameAvailable
                    ? 'text-green-500'
                    : 'text-gray-500'
                }
              />
            </div>

            <Button type="submit" loading={loading} className="mt-2">
              Create Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
