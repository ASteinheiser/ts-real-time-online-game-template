import { useQuery, gql } from '@apollo/client';
import { GetBooksQuery, GetBooksQueryVariables } from './graphql';

const GET_BOOKS = gql`
  query GetBooks {
    books {
      title
      author
    }
  }
`;

export const App = () => {
  const { data } = useQuery<GetBooksQuery, GetBooksQueryVariables>(GET_BOOKS);

  console.log({ gqlData: data });

  return (
    <div className="flex justify-center items-center h-screen">
      Yo what is up this is a demo marketing site for a game!
    </div>
  );
};
