import { useState } from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui';
import { Menu } from '@repo/ui/icons';
import { cn } from '@repo/ui/utils';
import { useSession } from '../router/SessionContext';

const MENU_CLOSE_DELAY = 100;

export const TopNav = () => {
  const { profile } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderNavLinks = () => {
    const navLinks = [{ label: 'DevLog', href: '/dev-log' }];
    if (profile) {
      navLinks.push({ href: '/download', label: 'Download' });
      navLinks.push({ href: '/profile', label: 'Profile' });
    } else {
      navLinks.push({ href: '/auth/login', label: 'Login' });
    }

    return navLinks.map(({ href, label }) => (
      <NavLink
        key={href}
        to={href}
        onClick={() => setTimeout(() => setIsMenuOpen(false), MENU_CLOSE_DELAY)}
      >
        {label}
      </NavLink>
    ));
  };

  return (
    <div className="fixed z-10 w-full bg-background/50 backdrop-blur-sm">
      <div className="max-w-screen-lg mx-auto flex flex-row-reverse sm:flex-row justify-between items-center py-4 px-4 sm:px-6">
        <Link to="/">
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
  const location = useLocation();

  const active =
    location.pathname === props.to ||
    (props.to === '/auth/login' && location.pathname.includes('/auth/'));

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
