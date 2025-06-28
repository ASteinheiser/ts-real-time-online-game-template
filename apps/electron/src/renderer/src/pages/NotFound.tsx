import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_ROUTES } from '@repo/client-auth/router';

export const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(AUTH_ROUTES.LOGIN);
  }, [navigate]);

  return null;
};
