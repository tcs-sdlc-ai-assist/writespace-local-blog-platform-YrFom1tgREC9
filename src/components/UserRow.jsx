import React from 'react';
import PropTypes from 'prop-types';
import Avatar, { getAvatar } from './Avatar';

/**
 * UserRow component displays a user row/card for admin user management.
 * Includes avatar, role badge, username/email, and delete button.
 * @param {object} props
 * @param {object} props.user - User object { id, username, email, role }
 * @param {function} props.onDelete - Callback when delete is clicked
 * @param {boolean} props.loading - Show loading spinner for delete
 * @param {boolean} props.error - Show error state for delete
 */
function UserRow({ user, onDelete, loading, error }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-md px-4 py-3 mb-2">
      <div className="flex items-center space-x-4">
        {getAvatar(user.role)}
        <div>
          <div className="font-semibold text-gray-800">{user.username}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        <span
          className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            user.role === 'admin'
              ? 'bg-red-100 text-red-700'
              : user.role === 'user'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {user.role}
        </span>
      </div>
      <button
        className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
          loading
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
        onClick={() => onDelete(user.id)}
        disabled={loading}
        type="button"
        aria-label={`Delete user ${user.username}`}
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4h6v3M10 11v6M14 11v6M4 7h16l-1 14H5L4 7z" />
          </svg>
        )}
      </button>
      {error && (
        <span className="ml-4 text-xs text-red-500">Failed to delete</span>
      )}
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

UserRow.defaultProps = {
  loading: false,
  error: false,
};

export default UserRow;