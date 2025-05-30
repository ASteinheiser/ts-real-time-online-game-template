import { useQuery, gql } from '@apollo/client';
import { cn } from '@repo/ui';
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
        <img src="/logo.svg" alt="logo" className="w-45 h-45 hover:animate-ping" />

        <div className="w-[2px] h-35 bg-secondary" />

        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold font-title">TypeScript Game Template</span>
          <span className="text-2xl font-bold font-title">Marketing Website</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-20 px-4">
        <HomeSection
          isFlipped
          image="/logo.svg"
          title="Build Your Game"
          description={
            <>
              Create your game inside of <code>apps/electron</code> (Electron/React/Phaser client)
              and <code>apps/game-server</code> (Colyseus/Apollo server).
            </>
          }
        />
        <HomeSection
          image="/logo.svg"
          title="Adjust To Your Needs"
          description={
            <>
              Depending on your target platform (Mobile vs Web vs Desktop), you may want to consider
              hosting your game as a SPA (with PWA support), or React Native.
            </>
          }
        />
        <HomeSection
          isFlipped
          image="/logo.svg"
          title="Publish It Yourself"
          description={
            <>
              Publish your game yourself! Allow users to download straight from your marketing site.
              You can also easily distribute via Steam, itch.io, etc.
            </>
          }
        />
      </div>
    </div>
  );
};

interface HomeSectionProps {
  image: string;
  title: string;
  description: React.ReactNode;
  isFlipped?: boolean;
}

const HomeSection = ({ image, title, description, isFlipped }: HomeSectionProps) => {
  return (
    <div
      className={cn('flex flex-row items-center gap-20 max-w-4xl', isFlipped && 'flex-row-reverse')}
    >
      <img src={image} alt={title} className="w-100 h-100 hover:animate-spin" />

      <div className="flex flex-col gap-6">
        <h2 className="text-4xl font-title">{title}</h2>
        <p className="text-lg  text-gray-300">{description}</p>
      </div>
    </div>
  );
};
