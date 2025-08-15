import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@repo/ui';
import { SUPABASE_AUTH } from '../provider/constants';

/** Handles showing a toast to the user when they click on a supabase email link */
export const useNotifyOnURLHash = () => {
  const { hash } = useLocation();
  const hashToastRef = useRef('');

  useEffect(() => {
    // supabase will add this hash to the url when a user clicks
    // the first of two emails while updating their email address
    if (hash.includes(SUPABASE_AUTH.HASH.EMAIL_CHANGE) && hashToastRef.current !== hash) {
      hashToastRef.current = hash;
      toast.success('Please click the confirmation link sent to the other email', {
        duration: 10000,
      });
    }
    // supabase will add this hash when a user clicks an expired email link
    if (hash.includes(SUPABASE_AUTH.HASH.LINK_EXPIRED) && hashToastRef.current !== hash) {
      hashToastRef.current = hash;
      toast.error('Email link is invalid or has expired', { duration: 10000 });
    }
  }, [hash]);
};
