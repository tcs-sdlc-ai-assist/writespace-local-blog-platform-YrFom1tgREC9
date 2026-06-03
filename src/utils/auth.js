import { getUsers, setUsers, getSession, setSession, clearSession } from './storage';

/**
 * Register a new user.
 * @param {string} username
 * @param {string} password
 * @param {string} role - 'user' or 'admin'
 * @returns {{success: boolean, error?: string, user?: object}}
 */
export function register(username, password, role = 'user') {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }
  const users = getUsers();
  const exists = users.find(u => u.username === username);
  if (exists) {
    return { success: false, error: 'Username already exists.' };
  }
  const user = {
    id: Date.now(),
    username,
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  setUsers(users);
  setSession({ id: user.id, username: user.username, role: user.role });
  return { success: true, user };
}

/**
 * Log in a user.
 * @param {string} username
 * @param {string} password
 * @returns {{success: boolean, error?: string, user?: object}}
 */
export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid username or password.' };
  }
  setSession({ id: user.id, username: user.username, role: user.role });
  return { success: true, user };
}

/**
 * Log out the current user.
 */
export function logout() {
  clearSession();
}

/**
 * Get the current session user.
 * @returns {object|null}
 */
export function getCurrentSession() {
  return getSession();
}