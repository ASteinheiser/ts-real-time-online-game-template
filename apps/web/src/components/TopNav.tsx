import { useState } from 'react';
import { useLocation, Link, type LinkProps } from 'react-router-dom';
import { useSession } from '@repo/client-auth/provider';
import { AUTH_ROUTES, AUTH_PATH_PREFIX, PROFILE_PATH_PREFIX } from '@repo/client-auth/router';
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui';
import { Menu } from '@repo/ui/icons';
import { cn } from '@repo/ui/utils';
import { APP_ROUTES } from '../router/constants';

/** Adds a smooth delay when closing the mobile menu (in ms) */
const MENU_CLOSE_DELAY = 100;

type NavLinks = Array<{ href: string; label: string }>;

export const TopNav = () => {
  const { session } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderNavLinks = () => {
    const navLinks: NavLinks = [
      { href: APP_ROUTES.DEV_LOG, label: 'DevLog' },
      { href: APP_ROUTES.DOWNLOAD, label: 'Download' },
    ];
    if (session) {
      navLinks.push({ href: AUTH_ROUTES.PROFILE, label: 'Profile' });
    } else {
      navLinks.push({ href: AUTH_ROUTES.LOGIN, label: 'Login' });
    }

    return navLinks.map(({ href, label }) => (
      <NavLink key={href} to={href} onClick={() => setTimeout(() => setIsMenuOpen(false), MENU_CLOSE_DELAY)}>
        {label}
      </NavLink>
    ));
  };

  return (
    <div className="fixed z-10 w-full bg-background/50 backdrop-blur-sm">
      <div className="max-w-screen-lg mx-auto flex flex-row-reverse sm:flex-row justify-between items-center py-4 px-4 sm:px-6">
        <Link to={APP_ROUTES.HOME}>
          <img src="/logo.svg" alt="logo" className="w-12 h-12 hover:animate-pulse" />
        </Link>

        <div className="hidden sm:flex gap-12">{renderNavLinks()}</div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button className="sm:hidden cursor-pointer">
              <Menu size={36} className="text-muted-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-2/3">
            <div className="flex flex-col items-center gap-8 pt-10">{renderNavLinks()}</div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
}

const NavLink = ({ children, ...props }: NavLinkProps) => {
  const { pathname } = useLocation();

  const active =
    pathname === props.to ||
    // shim to ensure "Login" top nav link is active when on any auth page
    (props.to === AUTH_ROUTES.LOGIN && pathname.includes(AUTH_PATH_PREFIX)) ||
    // shim to ensure "Profile" top nav link is active when on any profile page
    (props.to === AUTH_ROUTES.PROFILE && pathname.includes(PROFILE_PATH_PREFIX));

  return (
    <Link
      {...props}
      className={cn(
        'font-title text-2xl sm:text-xl border-b-2 transition-all duration-300 ease-in-out',
        active ? 'border-primary' : 'border-transparent hover:border-white'
      )}
    >
      {children}
    </Link>
  );
};
