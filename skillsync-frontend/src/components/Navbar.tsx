import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser, FiGrid, FiUsers, FiBriefcase, FiPlusCircle, FiBell, FiEdit, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CollaborationService from '../services/CollaborationService';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      CollaborationService.getReceivedRequests(user.userId)
        .then(reqs => setPendingCount(reqs.filter((r: any) => r.status === 'PENDING').length))
        .catch(() => {});
    } else {
      setPendingCount(0);
    }
  }, [isAuthenticated, user?.userId]);

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setAvatarOpen(false);
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/projects', icon: <FiBriefcase className="w-4 h-4" />, label: 'Projects' },
    { to: '/teammates', icon: <FiUsers className="w-4 h-4" />, label: 'Find Teammates' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-sm dark:bg-slate-900/95 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl text-pink-700 select-none flex-shrink-0">
          <span className="bg-gradient-to-br from-pink-600 to-rose-500 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shadow-sm">S</span>
          <span className="hidden sm:inline">SkillSync</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(l.to)
                  ? 'text-pink-700 bg-pink-50 font-semibold dark:text-pink-400 dark:bg-pink-950/30'
                  : 'text-slate-600 hover:text-pink-700 hover:bg-pink-50/70 dark:text-slate-400 dark:hover:text-pink-400 dark:hover:bg-pink-950/20'
              }`}>
              {l.icon}{l.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Dark mode toggle */}
          <button type="button" onClick={toggleTheme}
            className="btn btn-ghost btn-sm px-2.5"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark
              ? <FiSun className="w-4 h-4 text-amber-400" />
              : <FiMoon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/projects/create" className="btn-primary btn-sm shadow-sm">
                <FiPlusCircle className="w-3.5 h-3.5" />New Project
              </Link>
              <Link to="/requests"
                className={`relative btn btn-sm px-2.5 ${isActive('/requests') ? 'bg-rose-50 text-rose-600 border-2 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-700' : 'btn-secondary'}`}
                title="Collaboration Requests">
                <FiBell className="w-4 h-4" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </Link>
              <div className="relative" ref={avatarRef}>
                <button type="button" onClick={() => setAvatarOpen(v => !v)}
                  className="avatar-md hover:ring-2 hover:ring-pink-400 hover:ring-offset-1 transition-all text-sm cursor-pointer">
                  {initials}
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-slate-200/80 rounded-2xl shadow-2xl w-52 py-2 z-50 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                    <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-slate-100 dark:from-slate-800 dark:to-slate-800 dark:border-slate-700">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-pink-400" onClick={() => setAvatarOpen(false)}>
                        <FiGrid className="w-4 h-4 text-slate-400" />Dashboard
                      </Link>
                      <Link to={`/users/${user?.userId}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-pink-400" onClick={() => setAvatarOpen(false)}>
                        <FiUser className="w-4 h-4 text-slate-400" />My Profile
                      </Link>
                      <Link to="/profile/edit" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-pink-400" onClick={() => setAvatarOpen(false)}>
                        <FiEdit className="w-4 h-4 text-slate-400" />Edit Profile
                      </Link>
                      <Link to="/applications" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-pink-400" onClick={() => setAvatarOpen(false)}>
                        <FiBriefcase className="w-4 h-4 text-slate-400" />Applications
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left transition-colors">
                        <FiLogOut className="w-4 h-4" />Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
              <Link to="/register" className="btn-primary btn-sm">Sign Up Free</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isDark ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4" />}
          </button>
          <button type="button" className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 flex flex-col gap-1 shadow-lg">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? 'bg-pink-50 text-pink-700 font-semibold dark:bg-pink-950/30 dark:text-pink-400'
                  : 'text-slate-700 hover:bg-pink-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              onClick={() => setMenuOpen(false)}>
              {l.icon}{l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setMenuOpen(false)}><FiGrid className="w-4 h-4" />Dashboard</Link>
              <Link to="/requests" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setMenuOpen(false)}><FiBell className="w-4 h-4" />Requests {pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{pendingCount}</span>}</Link>
              <Link to="/applications" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setMenuOpen(false)}><FiBriefcase className="w-4 h-4" />Applications</Link>
              <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-2 flex gap-2">
                <Link to="/projects/create" className="btn-primary btn-sm flex-1 justify-center" onClick={() => setMenuOpen(false)}><FiPlusCircle />New Project</Link>
                <button type="button" onClick={handleLogout} className="btn btn-danger btn-sm flex-1 justify-center"><FiLogOut />Log Out</button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 mt-1">
              <Link to="/login" className="btn btn-secondary btn-sm flex-1 justify-center" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="btn-primary btn-sm flex-1 justify-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
