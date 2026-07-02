import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { MdRestaurantMenu } from 'react-icons/md';
import {
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineViewGrid,
  HiOutlineTable,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineUserAdd,
} from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const customerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
    { to: '/book', label: 'Book Table', icon: HiOutlineCalendar },
    { to: '/my-reservations', label: 'My Reservations', icon: HiOutlineClipboardList },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: HiOutlineViewGrid },
    { to: '/admin/tables', label: 'Manage Tables', icon: HiOutlineTable },
  ];

  const navLinks = isAdmin ? adminLinks : customerLinks;

  return (
    <nav className="glass-strong sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <MdRestaurantMenu className="w-5 h-5 text-dark-950" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              ReserveIt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated &&
              navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(to)
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800/50 border border-dark-700/50">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-dark-950">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-200">{user?.name}</p>
                    <p className="text-[10px] text-dark-500 uppercase tracking-wider">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-dark-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive('/login')
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-dark-400 hover:text-dark-200'
                  }`}
                >
                  <HiOutlineLogin className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">
                  <span className="flex items-center gap-2">
                    <HiOutlineUserAdd className="w-4 h-4" />
                    Register
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-dark-400 hover:text-dark-200 hover:bg-dark-800/50 transition-all"
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiOutlineMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="flex flex-col gap-1 pt-2 border-t border-dark-700/50">
              {isAuthenticated ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <span className="text-sm font-bold text-dark-950">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-200">{user?.name}</p>
                      <p className="text-xs text-dark-500 uppercase tracking-wider">{user?.role}</p>
                    </div>
                  </div>

                  {navLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive(to)
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark-400 hover:text-red-400 hover:bg-red-500/5 mt-2 border-t border-dark-700/50 pt-3 transition-all"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark-400 hover:text-dark-200 transition-all"
                  >
                    <HiOutlineLogin className="w-5 h-5" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-primary-400 hover:text-primary-300 transition-all"
                  >
                    <HiOutlineUserAdd className="w-5 h-5" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
