import { useQuery, gql } from '@apollo/client';
import { GetBooksQuery, GetBooksQueryVariables } from '../graphql';
import { useSession } from '../router/SessionContext';

const GET_BOOKS = gql`
  query GetBooks {
    books {
      title
      author
    }
  }
`;

export const Home = () => {
  const { session } = useSession();
  const { data } = useQuery<GetBooksQuery, GetBooksQueryVariables>(GET_BOOKS);

  console.log({ gqlData: data });
  console.log({ session });

  return (
    <div className="flex justify-center items-center h-screen">
      <span className="text-2xl font-bold font-title">
        Yo what is up this is a demo marketing site for a game!
      </span>
    </div>
  );
};
