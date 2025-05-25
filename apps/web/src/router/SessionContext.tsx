import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { gql, useApolloClient } from '@apollo/client';
import { supabase } from '../supabase-client';
import { Loading } from '../pages/Loading';
import { Web_GetProfileQuery } from '../graphql';

const GET_PROFILE = gql`
  query Web_GetProfile {
    profile {
      userName
    }
  }
`;

export type Profile = NonNullable<Web_GetProfileQuery['profile']>;

interface SessionContextType {
  session: Session | null;
  profile: Profile | null;
}

const SessionContext = createContext<SessionContextType>({ session: null, profile: null });

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const client = useApolloClient();

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      await getProfile(session);
      setIsLoading(false);
    });

    const getProfile = async (session: Session | null) => {
      if (!session) {
        setProfile(null);
        return;
      }

      const { data, error } = await client.query<Web_GetProfileQuery>({
        query: GET_PROFILE,
      });
      if (error) {
        console.error(error);
      }
      setProfile(data?.profile ?? null);
    };

    return () => {
      authStateListener.data.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider value={{ session, profile }}>
      {isLoading ? <Loading /> : children}
    </SessionContext.Provider>
  );
};
