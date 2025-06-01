import { Link, LinkProps, useLocation } from 'react-router-dom';
import { cn } from '@repo/ui';
import { useSession } from '../../router/SessionContext';

export const TopNav = () => {
  const { profile } = useSession();

  return (
    <div className="fixed z-100 w-full bg-background/50 backdrop-blur-sm">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center py-4 px-10">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="w-12 h-12 hover:animate-pulse" />
        </Link>

        <div className="flex gap-12">
          <NavLink to="/dev-log">DevLog</NavLink>

          {profile ? (
            <>
              <NavLink to="/download">Download</NavLink>
              <NavLink to="/profile">Profile</NavLink>
            </>
          ) : (
            <NavLink to="/auth/login">Login</NavLink>
          )}
        </div>
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
        'font-title text-lg border-b-2 transition-all duration-300 ease-in-out',
        active ? 'border-primary' : 'border-transparent hover:border-white'
      )}
    >
      {children}
    </Link>
  );
};
