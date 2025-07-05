import { createContext, useContext, useEffect, useState } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import {
  Session,
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  UserResponse,
} from '@supabase/supabase-js';
import { Button, LoadingSpinner, toast } from '@repo/ui';
import { supabase } from './supabase-client';
import type { Auth_GetProfileQuery, Auth_GetProfileQueryVariables } from '../graphql';
import { AUTH_ROUTES } from '../router/constants';
import { useHealthCheck } from '../hooks/useHealthCheck';

const GET_PROFILE = gql`
  query Auth_GetProfile {
    profile {
      userName
    }
  }
`;

export type Profile = NonNullable<Auth_GetProfileQuery['profile']>;

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
  healthCheckEnabled?: boolean;
}

export const SessionProvider = ({ children, healthCheckEnabled = false }: SessionProviderProps) => {
  const client = useApolloClient();

  const {
    isHealthy,
    loading: isHealthCheckLoading,
    refetch: refetchHealthCheck,
  } = useHealthCheck({
    enabled: healthCheckEnabled,
  });

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStateListener = supabase.auth.onAuthStateChange((event, session) => {
      setSession((previous) => {
        // only set loading state on initial load -- prevents showing create profile when logging in
        if (session && previous === null) setIsLoading(true);
        return session;
      });
      setIsPasswordRecovery((previous) => {
        if (event === 'PASSWORD_RECOVERY') return true;
        if (previous && event === 'USER_UPDATED') return false;
        return previous;
      });
    });

    return () => {
      authStateListener.data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (healthCheckEnabled && !isHealthy) {
      // if still loading, wait for server to be healthy before fetching profile
      if (isHealthCheckLoading) return;
      // otherwise, assume server is down -- don't fetch profile, set loading to false
      setIsLoading(false);
      return;
    }
    // if no session, remove existing profile and don't try to fetch
    if (!session) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    getProfile(session);
  }, [session, healthCheckEnabled, isHealthy, isHealthCheckLoading]);

  const getProfile = async (_session: Session) => {
    try {
      const { data, error } = await client.query<Auth_GetProfileQuery, Auth_GetProfileQueryVariables>({
        query: GET_PROFILE,
        context: { headers: { authorization: _session.access_token } },
        fetchPolicy: 'network-only',
      });
      if (error) throw error;

      setProfile(data?.profile ?? null);
    } catch (error) {
      console.error(error);
      toast.error('Oops! Something went wrong fetching your profile...');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
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
    const redirectTo = `${window.location.origin}${AUTH_ROUTES.NEW_PASSWORD}`;

    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  };

  const newPassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };

  const changeEmail = async (email: string) => {
    const emailRedirectTo = `${window.location.origin}${AUTH_ROUTES.PROFILE}`;

    return await supabase.auth.updateUser({ email }, { emailRedirectTo });
  };

  const refetchProfile = async () => {
    if (session) await getProfile(session);
  };

  const renderContent = () => {
    if (isLoading || isHealthCheckLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      );
    }

    if (healthCheckEnabled && !isHealthy) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Oops! Sorry about that...</h1>
            <p className="text-lg text-muted pt-4 pb-6">There was an issue connecting to the server</p>

            <Button size="lg" onClick={refetchHealthCheck}>
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return children;
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
      {renderContent()}
    </SessionContext.Provider>
  );
};
