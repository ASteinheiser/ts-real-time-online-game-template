import { createContext, useContext, useEffect, useState } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import {
  Session,
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  UserResponse,
} from '@supabase/supabase-js';
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
  login: (email: string, password: string) => Promise<AuthTokenResponsePassword>;
  signup: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<{ error: AuthError | null }>;
  forgotPassword: (email: string) => Promise<{ error: AuthError | null }>;
  newPassword: (password: string) => Promise<UserResponse>;
  changeEmail: (email: string) => Promise<UserResponse>;
  refetchProfile: () => Promise<void>;
}

const dummyAsyncFunc = async () => {
  throw new Error('not loaded');
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  profile: null,
  isPasswordRecovery: false,
  login: dummyAsyncFunc,
  signup: dummyAsyncFunc,
  logout: dummyAsyncFunc,
  forgotPassword: dummyAsyncFunc,
  newPassword: dummyAsyncFunc,
  changeEmail: dummyAsyncFunc,
  refetchProfile: dummyAsyncFunc,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setIsPasswordRecovery((isRecovery) => {
        if (event === 'PASSWORD_RECOVERY') return true;
        if (isRecovery && event === 'USER_UPDATED') return false;
        return isRecovery;
      });
      await getProfile(session);
      setLoading(false);
    });

    return () => {
      authStateListener.data.subscription.unsubscribe();
    };
  }, [supabase]);

  const getProfile = async (_session: Session | null) => {
    if (!_session) {
      setProfile(null);
      return;
    }

    const { data, error } = await client.query<Web_GetProfileQuery>({
      query: GET_PROFILE,
      context: { headers: { authorization: _session.access_token } },
      fetchPolicy: 'network-only',
    });
    if (error) {
      console.error(error);
    }
    setProfile(data?.profile ?? null);
  };

  const login = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signup = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  };

  const logout = async () => {
    return await supabase.auth.signOut();
  };

  const forgotPassword = async (email: string) => {
    const redirectTo = `${window.location.origin}/auth/new-password`;

    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  };

  const newPassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };

  const changeEmail = async (email: string) => {
    const emailRedirectTo = `${window.location.origin}/profile`;

    return await supabase.auth.updateUser({ email }, { emailRedirectTo });
  };

  const refetchProfile = async () => {
    await getProfile(session);
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
        changeEmail,
        refetchProfile,
      }}
    >
      {loading ? <Loading /> : children}
    </SessionContext.Provider>
  );
};
