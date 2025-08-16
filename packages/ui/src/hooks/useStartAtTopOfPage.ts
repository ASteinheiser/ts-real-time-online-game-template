import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Ensures that the user starts at the top of the page when navigating in a SPA */
export const useStartAtTopOfPage = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};
