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
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center gap-8 h-screen mt-[-80px]">
        <img src="/logo.svg" alt="logo" className="w-45 h-45" />

        <div className="w-[2px] h-35 bg-secondary" />

        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold font-title">TypeScript Game Template</span>
          <span className="text-2xl font-bold font-title">Marketing Website</span>
        </div>
      </div>
    </div>
  );
};
