import { Link, LinkProps, useLocation } from 'react-router-dom';
import { cn, Sheet, SheetContent, SheetTrigger } from '@repo/ui';
import { useSession } from '../router/SessionContext';
import { Menu } from './icons/Menu';

export const TopNav = () => {
  const { profile } = useSession();

  const renderNavLinks = () => {
    return (
      <>
        <NavLink to="/dev-log">DevLog</NavLink>

        {profile ? (
          <>
            <NavLink to="/download">Download</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        ) : (
          <NavLink to="/auth/login">Login</NavLink>
        )}
      </>
    );
  };

  return (
    <div className="fixed z-10 w-full bg-background/50 backdrop-blur-sm">
      <div className="max-w-screen-lg mx-auto flex flex-row-reverse sm:flex-row justify-between items-center py-4 px-10">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="w-12 h-12 hover:animate-pulse" />
        </Link>

        <div className="hidden sm:flex gap-12">{renderNavLinks()}</div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="sm:hidden cursor-pointer">
              <Menu size={36} className="text-muted-light" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-1/2">
            <div className="flex flex-col gap-4 pl-6 pt-6">{renderNavLinks()}</div>
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
        'w-fit font-title text-lg border-b-2 transition-all duration-300 ease-in-out',
        active ? 'border-primary' : 'border-transparent hover:border-white'
      )}
    >
      {children}
    </Link>
  );
};
