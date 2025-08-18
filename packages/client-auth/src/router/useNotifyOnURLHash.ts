import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@repo/ui';
import { SUPABASE_AUTH } from '../provider/constants';
import { AUTH_SEARCH_PARAMS } from './constants';

/** Handles showing a toast to the user when they click on a supabase email link */
export const useNotifyOnURLHash = () => {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    // don't show toasts if we're opening a deep link (/auth/redirect)
    if (searchParams.get(AUTH_SEARCH_PARAMS.DEEP_LINK)) return;

    let didNotify = false;
    // handle custom hash for when email change is successful
    if (hash.includes(SUPABASE_AUTH.HASH.EMAIL_CHANGE_SUCCESS)) {
      toast.success('Email changed successfully');
      didNotify = true;
    }
    // supabase will add this hash to the url when a user clicks the first of two emails while updating their email address
    // ONLY IF `Secure email change` is set to `true`; see `README.md` for more info
    if (hash.includes(SUPABASE_AUTH.HASH.EMAIL_CHANGE)) {
      toast.success('Please click the confirmation link sent to the other email');
      didNotify = true;
    }
    // supabase will add this hash when a user clicks an expired email link
    if (hash.includes(SUPABASE_AUTH.HASH.LINK_EXPIRED)) {
      toast.error('Email link is invalid or has expired');
      didNotify = true;
    }

    // consume the hash by replacing the current URL without it to prevent duplicate toasts
    if (didNotify && hash) {
      navigate(`${pathname}${search}`, { replace: true });
    }
  }, [hash, pathname, search, navigate]);
};
