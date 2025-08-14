import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDeepLinks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.api?.onDeepLink?.((url: string) => {
      try {
        const { pathname, search, hash } = new URL(url);
        const path = pathname || '/';
        const normalizedUrl = `${path}${search}${hash}`;

        navigate(normalizedUrl, { replace: true });
      } catch (error) {
        console.error('Invalid deep link', error);
      }
    });
  }, [navigate]);
};
