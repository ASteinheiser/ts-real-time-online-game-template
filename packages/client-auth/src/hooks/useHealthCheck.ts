import { useEffect, useRef } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
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
  const retries = useRef(0);

  const [getHealthCheck, { data, loading }] = useLazyQuery<Auth_GetHealthCheckQuery>(GET_HEALTH_CHECK, {
    fetchPolicy: 'network-only',
  });
  const isHealthy = data?.healthCheck ?? false;

  useEffect(() => {
    if (enabled) checkHealth();
  }, [enabled]);

  const checkHealth = async () => {
    if (retries.current >= MAX_RETRIES) return;

    try {
      const { error } = await getHealthCheck();
      if (error) throw error;
    } catch {
      retries.current++;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      await checkHealth();
    }
  };

  return { isHealthy, loading };
};
