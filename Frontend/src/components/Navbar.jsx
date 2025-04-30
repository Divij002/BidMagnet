// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-transparent backdrop-blur-sm px-6 md:px-16 py-4 flex items-center justify-between text-textPrimary">
      {/* Logo + Title   use Lobster font */ }
      <div className="flex items-center gap-2">
        {/* Replace with your actual logo path */}
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 w-10 object-contain"
        />
        <Link
          to="/"
          className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-black"
        >
          BidMagnet
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-4 font-body text-black">
        {user ? (
          <>
            <Link to="/myorders" className="hover:text-primary transition">My Orders</Link>
            <button
              onClick={logout}
              className="text-secondary hover:text-primary transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="hover:text-primary transition">Sign In</Link>
            <Link to="/signup" className="hover:text-accent transition">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
