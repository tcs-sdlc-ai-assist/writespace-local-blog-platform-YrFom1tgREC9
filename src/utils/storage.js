/**
 * Utility functions for interacting with localStorage for posts, users, and session.
 * Handles JSON parsing/stringifying and errors gracefully.
 */

/**
 * Safely get a value from localStorage and parse as JSON.
 * @param {string} key
 * @returns {any|null}
 */
export function getItem(key) {
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value);
  } catch (err) {
    // Corrupted data or JSON parse error
    window.localStorage.removeItem(key);
    return null;
  }
}

/**
 * Safely set a value in localStorage as JSON.
 * @param {string} key
 * @param {any} value
 */
export function setItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Quota exceeded or serialization error
    // Optionally, could clear storage or notify user
  }
}

/**
 * Remove a key from localStorage.
 * @param {string} key
 */
export function removeItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    // Ignore
  }
}

// Keys used for storage
const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';
const SESSION_KEY = 'writespace_session';

/**
 * Get all posts from localStorage.
 * @returns {Array|null}
 */
export function getPosts() {
  const posts = getItem(POSTS_KEY);
  return Array.isArray(posts) ? posts : [];
}

/**
 * Save all posts to localStorage.
 * @param {Array} posts
 */
export function setPosts(posts) {
  setItem(POSTS_KEY, Array.isArray(posts) ? posts : []);
}

/**
 * Get all users from localStorage.
 * @returns {Array|null}
 */
export function getUsers() {
  const users = getItem(USERS_KEY);
  return Array.isArray(users) ? users : [];
}

/**
 * Save all users to localStorage.
 * @param {Array} users
 */
export function setUsers(users) {
  setItem(USERS_KEY, Array.isArray(users) ? users : []);
}

/**
 * Get the current session (logged-in user) from localStorage.
 * @returns {object|null}
 */
export function getSession() {
  return getItem(SESSION_KEY);
}

/**
 * Set the current session (logged-in user) in localStorage.
 * @param {object} session
 */
export function setSession(session) {
  setItem(SESSION_KEY, session);
}

/**
 * Remove the current session from localStorage.
 */
export function clearSession() {
  removeItem(SESSION_KEY);
}