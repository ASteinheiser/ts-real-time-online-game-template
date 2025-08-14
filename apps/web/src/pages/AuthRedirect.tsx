import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AUTH_REDIRECT_SEARCH_PARAM } from '@repo/client-auth/router';
import { Button } from '@repo/ui';

const DEEP_LINK_DELAY_MS = 100;

export const AuthRedirect = () => {
  const { search, hash } = useLocation();
  const navigate = useNavigate();

  const { redirect, extraQuery } = useMemo(() => {
    const params = new URLSearchParams(search);
    const _redirect = params.get(AUTH_REDIRECT_SEARCH_PARAM);
    const _extraQuery = new URLSearchParams(
      Array.from(params.entries()).filter(([k]) => k !== AUTH_REDIRECT_SEARCH_PARAM)
    ).toString();

    return { redirect: _redirect, extraQuery: _extraQuery };
  }, [search]);

  const deepLink = useMemo(() => {
    if (!redirect) return '';
    const glue = extraQuery ? (redirect.includes('?') ? '&' : '?') : '';

    return `${redirect}${glue}${extraQuery}${hash}`;
  }, [redirect, extraQuery, hash]);

  const webPathFallback = useMemo(() => {
    try {
      if (!redirect) return '/';
      const { pathname } = new URL(redirect);
      const query = extraQuery ? `?${extraQuery}` : '';

      return `${pathname}${query}${hash}`;
    } catch {
      return '/';
    }
  }, [redirect, extraQuery, hash]);

  useEffect(() => {
    if (!deepLink) {
      handleContinueOnWeb();
      return;
    }
    const timeout = setTimeout(() => {}, DEEP_LINK_DELAY_MS);
    handleOpenInApp();

    return () => clearTimeout(timeout);
  }, [deepLink, webPathFallback, navigate]);

  const handleContinueOnWeb = () => {
    navigate(webPathFallback, { replace: true });
  };

  const handleOpenInApp = () => {
    if (!deepLink) return;
    window.location.assign(deepLink);
  };

  return (
    <div className="fullscreen-center gap-6 text-center">
      <p className="text-3xl font-label text-muted max-w-sm">
        You should be redirected to the native app. If so, you can
        <span className="font-pixel text-primary"> close this page</span>
        <br />
        Otherwise, you can try to:
      </p>
      <div className="flex gap-4 justify-center">
        <Button size="lg" disabled={!deepLink} onClick={handleOpenInApp}>
          Open in app
        </Button>
        <Button size="lg" variant="secondary" onClick={handleContinueOnWeb}>
          Continue on web
        </Button>
      </div>
    </div>
  );
};
