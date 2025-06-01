import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const REDIRECT_DELAY_MS = 3000;

export const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate('/'), REDIRECT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-screen mt-nav-footer flex items-center justify-center px-4 pt-40">
      <span className="text-2xl font-bold font-title text-center">
        Oops! Page not found. Redirecting home...
      </span>
    </div>
  );
};
