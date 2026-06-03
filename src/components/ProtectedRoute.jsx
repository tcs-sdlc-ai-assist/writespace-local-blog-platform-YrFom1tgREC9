import React from 'react';
import PropTypes from 'prop-types';
import { getCurrentSession } from '../utils/auth';

/**
 * ProtectedRoute component for guarding routes based on authentication and role.
 * If not authenticated or role not allowed, renders fallback or nothing.
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render if allowed
 * @param {React.ReactNode} [props.fallback] - Fallback to render if not allowed
 * @param {Array<string>} [props.allowedRoles] - Array of allowed roles (e.g., ['admin'])
 * @returns {JSX.Element|null}
 */
function ProtectedRoute({ children, fallback = null, allowedRoles }) {
  const session = getCurrentSession();

  if (!session) {
    return fallback;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(session.role)) {
      return fallback;
    }
  }

  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  fallback: null,
  allowedRoles: undefined,
};

export default ProtectedRoute;