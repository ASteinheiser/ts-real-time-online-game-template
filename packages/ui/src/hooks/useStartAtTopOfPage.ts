import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useStartAtTopOfPage = () => {
  const location = useLocation();

  // ensure the user starts at the top of the page when navigating
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
};
