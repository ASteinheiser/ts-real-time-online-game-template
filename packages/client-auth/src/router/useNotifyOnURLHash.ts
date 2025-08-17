import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@repo/ui';
import { SUPABASE_AUTH } from '../provider/constants';

const TOAST_DURATION = 10000;

/** Handles showing a toast to the user when they click on a supabase email link */
export const useNotifyOnURLHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    // supabase will add this hash to the url when a user clicks
    // the first of two emails while updating their email address
    if (hash.includes(SUPABASE_AUTH.HASH.EMAIL_CHANGE)) {
      toast.success('Please click the confirmation link sent to the other email', {
        duration: TOAST_DURATION,
      });
    }
    // supabase will add this hash when a user clicks an expired email link
    if (hash.includes(SUPABASE_AUTH.HASH.LINK_EXPIRED)) {
      toast.error('Email link is invalid or has expired', {
        duration: TOAST_DURATION,
      });
    }
  }, [hash]);
};
