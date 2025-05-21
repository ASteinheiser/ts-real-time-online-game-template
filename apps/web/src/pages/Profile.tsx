import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Input, Label, LoadingSpinner } from '@repo/ui';
import { useSession } from '../router/SessionContext';
import {
  GetUserExistsQuery,
  GetUserExistsQueryVariables,
  UpdateUserNameMutation,
  UpdateUserNameMutationVariables,
} from '../graphql';

const GET_USER_EXISTS = gql`
  query GetUserExists($userName: String!) {
    userExists(userName: $userName)
  }
`;

const UPDATE_USER_NAME = gql`
  mutation UpdateUserName($userName: String!) {
    updateProfile(userName: $userName) {
      userName
    }
  }
`;

export const Profile = () => {
  const { profile } = useSession();
  const [userName, setUserName] = useState(profile?.userName ?? '');

  const { data, loading: userExistsLoading } = useQuery<
    GetUserExistsQuery,
    GetUserExistsQueryVariables
  >(GET_USER_EXISTS, { variables: { userName } });

  const [updateUserName, { loading: updateUserNameLoading }] = useMutation<
    UpdateUserNameMutation,
    UpdateUserNameMutationVariables
  >(UPDATE_USER_NAME);

  const loading = userExistsLoading || updateUserNameLoading;
  const isUserNameAvailable = data?.userExists;
  const isUserNameChanged = !!userName && userName !== profile?.userName;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isUserNameAvailable || !isUserNameChanged || !userName) return;

    await updateUserName({ variables: { userName } });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <span className="text-2xl font-bold font-title">Profile</span>

      <form onSubmit={handleSubmit}>
        <Label>Username</Label>
        <Input
          name="userName"
          value={userName}
          onChange={({ target }) => setUserName(target.value)}
        />
        {isUserNameChanged && !isUserNameAvailable && (
          <span className="text-red-500">Username is already taken</span>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Save'}
        </Button>
      </form>
    </div>
  );
};
