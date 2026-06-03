import React from 'react';
import PropTypes from 'prop-types';

function PublicNavbar({ onLogin, onRegister }) {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600">writespace</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          onClick={onLogin}
          type="button"
        >
          Log In
        </button>
        <button
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
          onClick={onRegister}
          type="button"
        >
          Register
        </button>
      </div>
    </nav>
  );
}

PublicNavbar.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};

export default PublicNavbar;