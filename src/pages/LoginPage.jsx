import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login, getCurrentSession } from '../utils/auth';

/**
 * LoginPage component renders a login form, handles authentication,
 * displays errors, and redirects if already logged in.
 * @param {object} props
 * @param {function} [props.onLoginSuccess] - Called with user after successful login
 * @param {function} [props.navigate] - Optional navigation function (e.g., from router)
 */
function LoginPage({ onLoginSuccess, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setRedirecting(true);
      if (onLoginSuccess) {
        onLoginSuccess(session);
      }
      if (navigate) {
        navigate('/'); // Redirect to home
      }
    }
  }, [onLoginSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // Simulate async for UX
      await new Promise((res) => setTimeout(res, 300));
      const result = login(username.trim(), password);
      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
        if (navigate) {
          navigate('/');
        }
      } else {
        setError(result.error || 'Login failed.');
      }
    } catch (err) {
      setError('Unexpected error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Sign in to writespace</h1>
        {redirecting && (
          <div className="mb-4 text-blue-500 text-center">
            Redirecting...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={submitting || redirecting}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={submitting || redirecting}
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold text-white transition-colors ${
              submitting || redirecting
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={submitting || redirecting}
          >
            {submitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle mr-2" />
            ) : null}
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="text-blue-600 hover:underline"
            tabIndex={-1}
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  onLoginSuccess: PropTypes.func,
  navigate: PropTypes.func,
};

export default LoginPage;