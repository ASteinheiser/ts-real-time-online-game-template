import { Link, LinkProps, useLocation } from 'react-router-dom';
import { useSession } from '../../router/SessionContext';

export const TopNav = () => {
  const { session } = useSession();

  return (
    <div className="fixed z-100 w-full bg-secondary">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center py-4 px-10">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="w-12 h-12 hover:animate-pulse" />
        </Link>

        {session ? (
          <div className="flex gap-12">
            <NavLink to="/download">Download</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </div>
        ) : (
          <NavLink to="/auth/login">Login</NavLink>
        )}
      </div>
    </div>
  );
};

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
}

const NavLink = ({ children, ...props }: NavLinkProps) => {
  const location = useLocation();

  const active = location.pathname === props.to;
  const activeStateStyles = active ? 'border-primary' : 'border-transparent hover:border-white';

  return (
    <Link {...props}>
      <div className={`font-title text-lg border-b-2 ${activeStateStyles}`}>{children}</div>
    </Link>
  );
};
