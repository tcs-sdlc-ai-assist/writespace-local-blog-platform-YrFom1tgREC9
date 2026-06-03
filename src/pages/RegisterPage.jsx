import React, { useState } from 'react';
import { register, getCurrentSession } from '../utils/auth';
import { getUsers } from '../utils/storage';
import PropTypes from 'prop-types';

/**
 * RegisterPage component renders a registration form with validation,
 * session logic, and redirect on success. Uses auth.js and storage.js.
 * @param {object} props
 * @param {function} [props.onRegistered] - Callback after successful registration
 * @param {function} [props.onRedirect] - Callback for redirect (optional)
 * @returns {JSX.Element}
 */
function RegisterPage({ onRegistered, onRedirect }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    const session = getCurrentSession();
    if (session && onRedirect) {
      onRedirect();
    }
  }, [onRedirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Validation
      if (!username.trim() || !password.trim()) {
        setError('Username and password are required.');
        setLoading(false);
        return;
      }
      if (username.length < 3) {
        setError('Username must be at least 3 characters.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      // Prevent duplicate admin registration
      if (role === 'admin') {
        const users = getUsers();
        const adminExists = users.some(u => u.role === 'admin');
        if (adminExists) {
          setError('An admin already exists. Only one admin allowed.');
          setLoading(false);
          return;
        }
      }
      const result = register(username.trim(), password.trim(), role);
      if (!result.success) {
        setError(result.error || 'Registration failed.');
        setLoading(false);
        return;
      }
      setLoading(false);
      if (onRegistered) {
        onRegistered(result.user);
      }
      if (onRedirect) {
        onRedirect();
      }
    } catch (err) {
      setError('Unexpected error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              id="role"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={role}
              onChange={e => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold transition-colors ${
              loading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Register'
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Already have an account?</span>
          <button
            className="ml-2 text-blue-600 hover:underline text-sm"
            type="button"
            onClick={onRedirect}
            disabled={loading}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

RegisterPage.propTypes = {
  onRegistered: PropTypes.func,
  onRedirect: PropTypes.func,
};

RegisterPage.defaultProps = {
  onRegistered: undefined,
  onRedirect: undefined,
};

export default RegisterPage;