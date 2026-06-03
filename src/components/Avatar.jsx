import React from 'react';
import PropTypes from 'prop-types';

const avatarStyles = {
  admin: {
    bg: 'bg-red-500',
    text: 'text-white',
    border: 'border-2 border-red-700',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
  },
  user: {
    bg: 'bg-blue-500',
    text: 'text-white',
    border: 'border-2 border-blue-700',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z"/>
      </svg>
    ),
  },
  default: {
    bg: 'bg-gray-400',
    text: 'text-white',
    border: 'border-2 border-gray-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="7" r="4"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a8.38 8.38 0 0113 0"/>
      </svg>
    ),
  },
};

/**
 * Returns a styled avatar JSX element for the given role.
 * @param {string} role - The user role ('admin', 'user', etc.)
 * @returns {JSX.Element}
 */
export function getAvatar(role) {
  const style = avatarStyles[role] || avatarStyles.default;
  return (
    <span
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${style.bg} ${style.text} ${style.border} shadow-md`}
      title={role}
    >
      {style.icon}
    </span>
  );
}

function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.string,
};

export default Avatar;