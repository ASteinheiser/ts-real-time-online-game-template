import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@repo/ui';
import { SUPABASE_AUTH } from '../provider/constants';

export const useNotifyOnURLHash = () => {
  const location = useLocation();
  const hashToastRef = useRef('');

  useEffect(() => {
    // supabase will add this hash to the url when a user clicks
    // the first of two emails while updating their email address
    if (location.hash.includes(SUPABASE_AUTH.HASH.EMAIL_CHANGE) && hashToastRef.current !== location.hash) {
      hashToastRef.current = location.hash;
      toast.success('Please click the confirmation link sent to the other email', {
        duration: 10000,
      });
    }
    // supabase will add this hash when a user clicks an expired email link
    if (location.hash.includes(SUPABASE_AUTH.HASH.LINK_EXPIRED) && hashToastRef.current !== location.hash) {
      hashToastRef.current = location.hash;
      toast.error('Email link is invalid or has expired', { duration: 10000 });
    }
  }, [location.hash]);
};
