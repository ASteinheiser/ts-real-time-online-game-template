import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Input, Label, LoadingSpinner } from '@repo/ui';
import { CreateProfileMutation, CreateProfileMutationVariables } from '../../graphql';

const CREATE_PROFILE = gql`
  mutation CreateProfile($userName: String!) {
    createProfile(userName: $userName) {
      userName
    }
  }
`;

export const ProfileCreate = () => {
  const [userName, setUserName] = useState('');
  const [createProfile, { loading }] = useMutation<
    CreateProfileMutation,
    CreateProfileMutationVariables
  >(CREATE_PROFILE);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName) return;

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

        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Create Profile'}
        </Button>
      </form>
    </div>
  );
};
