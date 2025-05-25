import { useEffect, useState } from 'react';
import { ApolloError, gql, useLazyQuery } from '@apollo/client';
import { Web_GetUserExistsQuery, Web_GetUserExistsQueryVariables } from '../graphql';
import { useDebounce } from './useDebounce';

const GET_USER_NAME_EXISTS = gql`
  query Web_GetUserExists($userName: String!) {
    userExists(userName: $userName)
  }
`;

interface UseUserNameExistsResult {
  userNameExists?: boolean;
  loading: boolean;
  error?: ApolloError;
}

export const useUserNameExists = (userName: string): UseUserNameExistsResult => {
  const [userNameExists, setUserNameExists] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApolloError>();

  const debouncedUserName = useDebounce(userName, 500);

  const [queryUserNameExists] = useLazyQuery<
    Web_GetUserExistsQuery,
    Web_GetUserExistsQueryVariables
  >(GET_USER_NAME_EXISTS);

  useEffect(() => {
    if (debouncedUserName !== '') {
      checkUserNameExists();
    }
  }, [debouncedUserName]);

  const checkUserNameExists = async () => {
    setLoading(true);
    try {
      const { data, error } = await queryUserNameExists({
        variables: { userName: debouncedUserName },
      });
      if (error) setError(error);
      setUserNameExists(data?.userExists ?? undefined);
    } catch (error) {
      console.error(error);
      setError(error as ApolloError);
    } finally {
      setLoading(false);
    }
  };

  return { userNameExists, loading, error };
};
