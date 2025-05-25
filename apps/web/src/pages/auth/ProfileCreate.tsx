import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Input, Label, LoadingSpinner } from '@repo/ui';
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

    if (!userName || !isUserNameAvailable) return;

    await createProfile({ variables: { userName } });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold font-title">ProfileCreate</h1>

      <form onSubmit={handleSubmit}>
        <Label>Username</Label>
        <Input
          name="userName"
          value={userName}
          onChange={({ target }) => setUserName(target.value)}
        />
        {!isUserNameAvailable && <span className="text-red-500">Username is already taken</span>}

        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Create Profile'}
        </Button>
      </form>
    </div>
  );
};
