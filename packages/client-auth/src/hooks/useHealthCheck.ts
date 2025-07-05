import { useEffect, useRef, useState } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import type { Auth_GetHealthCheckQuery } from '../graphql';

const MAX_RETRIES = 10;
const RETRY_DELAY = 500;

const GET_HEALTH_CHECK = gql`
  query Auth_GetHealthCheck {
    healthCheck
  }
`;

interface UseHealthCheckProps {
  enabled: boolean;
}

interface UseHealthCheckResult {
  isHealthy: boolean;
  loading: boolean;
}

export const useHealthCheck = ({ enabled }: UseHealthCheckProps): UseHealthCheckResult => {
  const client = useApolloClient();
  const retries = useRef(0);

  const [isHealthy, setIsHealthy] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enabled) {
      setLoading(true);
      checkHealth();
    }
  }, [enabled]);

  const checkHealth = async () => {
    if (retries.current >= MAX_RETRIES) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await client.query<Auth_GetHealthCheckQuery>({
        query: GET_HEALTH_CHECK,
        fetchPolicy: 'network-only',
      });
      if (error) throw error;
      setIsHealthy(data?.healthCheck ?? false);
      setLoading(false);
    } catch {
      retries.current++;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      await checkHealth();
    }
  };

  return { isHealthy, loading };
};
