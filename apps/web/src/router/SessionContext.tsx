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
  isPasswordRecovery: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  newPassword: (password: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  profile: null,
  isPasswordRecovery: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  newPassword: async () => {},
});

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
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setIsPasswordRecovery(event === 'PASSWORD_RECOVERY');
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

  const login = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password });
  };

  const signup = async (email: string, password: string) => {
    await supabase.auth.signUp({ email, password });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const forgotPassword = async (email: string) => {
    const redirectTo = `${window.location.origin}/auth/new-password`;

    await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  };

  const newPassword = async (password: string) => {
    await supabase.auth.updateUser({ password });
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        profile,
        isPasswordRecovery,
        login,
        signup,
        logout,
        forgotPassword,
        newPassword,
      }}
    >
      {isLoading ? <Loading /> : children}
    </SessionContext.Provider>
  );
};
