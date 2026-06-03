import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar, { getAvatar } from './Avatar';

/**
 * Navbar component for authenticated users.
 * Shows app name, role-based links, user avatar, display name, and logout.
 * Responsive: hamburger menu for mobile.
 * @param {object} props
 * @param {object} props.user - Current user { username, role }
 * @param {function} props.onLogout - Logout handler
 * @param {function} [props.onNavigate] - Optional navigation handler (for SPA navigation)
 */
function Navbar({ user, onLogout, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Home', to: '/', roles: ['user', 'admin'] },
    { label: 'My Posts', to: '/my-posts', roles: ['user', 'admin'] },
    { label: 'New Post', to: '/new', roles: ['user', 'admin'] },
    { label: 'Admin', to: '/admin', roles: ['admin'] },
  ];

  function handleNav(to, e) {
    if (onNavigate) {
      e.preventDefault();
      setMenuOpen(false);
      onNavigate(to);
    } else {
      setMenuOpen(false);
    }
  }

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md relative z-20">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600">writespace</span>
      </div>
      {/* Desktop links */}
      <div className="hidden md:flex items-center space-x-4">
        {links
          .filter(link => link.roles.includes(user.role))
          .map(link => (
            <a
              key={link.to}
              href={link.to}
              className="px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-blue-50 transition-colors"
              onClick={e => handleNav(link.to, e)}
            >
              {link.label}
            </a>
          ))}
        <div className="flex items-center space-x-2 ml-4">
          {getAvatar(user.role)}
          <span className="text-sm font-semibold text-gray-800">{user.username}</span>
          <button
            className="ml-2 px-3 py-1 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
            onClick={() => onLogout()}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Mobile hamburger */}
      <div className="md:hidden flex items-center">
        <button
          className="p-2 rounded-md hover:bg-blue-50 focus:outline-none"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Open menu"
          type="button"
        >
          <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-stretch md:hidden animate-fade-in z-30">
          {links
            .filter(link => link.roles.includes(user.role))
            .map(link => (
              <a
                key={link.to}
                href={link.to}
                className="px-6 py-3 border-b border-gray-100 text-gray-700 font-medium hover:bg-blue-50 transition-colors"
                onClick={e => handleNav(link.to, e)}
              >
                {link.label}
              </a>
            ))}
          <div className="flex items-center px-6 py-3 space-x-2 border-b border-gray-100">
            {getAvatar(user.role)}
            <span className="text-sm font-semibold text-gray-800">{user.username}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              user.role === 'admin'
                ? 'bg-red-100 text-red-700'
                : user.role === 'user'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {user.role}
            </span>
          </div>
          <button
            className="w-full text-left px-6 py-3 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            onClick={() => { setMenuOpen(false); onLogout(); }}
            type="button"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

Navbar.defaultProps = {
  onNavigate: undefined,
};

export default Navbar;