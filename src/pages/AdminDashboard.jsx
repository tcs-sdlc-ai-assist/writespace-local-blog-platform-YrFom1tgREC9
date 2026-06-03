import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import StatCard from '../components/StatCard';
import BlogCard from '../components/BlogCard';
import UserRow from '../components/UserRow';
import { getPosts, getUsers, setUsers } from '../utils/storage';
import { logout, getCurrentSession } from '../utils/auth';
import Navbar from '../components/Navbar';

/**
 * AdminDashboard page: shows stats, quick actions, recent posts, and user management.
 * Only accessible to admin users.
 */
function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    posts: 0,
  });
  const [users, setUsersState] = useState([]);
  const [posts, setPostsState] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteError, setDeleteError] = useState({});
  const [error, setError] = useState('');
  const session = getCurrentSession();

  useEffect(() => {
    try {
      setLoadingStats(true);
      setLoadingUsers(true);
      setLoadingPosts(true);
      const usersList = getUsers();
      const postsList = getPosts();
      setUsersState(usersList);
      setPostsState(postsList);
      setStats({
        users: usersList.length,
        admins: usersList.filter(u => u.role === 'admin').length,
        posts: postsList.length,
      });
    } catch (e) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoadingStats(false);
      setLoadingUsers(false);
      setLoadingPosts(false);
    }
  }, []);

  function handleLogout() {
    logout();
    window.location.reload();
  }

  function handleNavigate(to) {
    window.location.href = to;
  }

  function handleDeleteUser(userId) {
    setDeleteLoading(prev => ({ ...prev, [userId]: true }));
    setDeleteError(prev => ({ ...prev, [userId]: false }));
    setTimeout(() => {
      try {
        // Prevent admin from deleting self
        if (session && session.id === userId) {
          setDeleteError(prev => ({ ...prev, [userId]: true }));
          setDeleteLoading(prev => ({ ...prev, [userId]: false }));
          return;
        }
        const usersList = getUsers();
        const user = usersList.find(u => u.id === userId);
        // Prevent deleting last admin
        if (user && user.role === 'admin') {
          const adminCount = usersList.filter(u => u.role === 'admin').length;
          if (adminCount <= 1) {
            setDeleteError(prev => ({ ...prev, [userId]: true }));
            setDeleteLoading(prev => ({ ...prev, [userId]: false }));
            return;
          }
        }
        const updated = usersList.filter(u => u.id !== userId);
        setUsers(updated);
        setUsersState(updated);
        setStats(s => ({
          ...s,
          users: updated.length,
          admins: updated.filter(u => u.role === 'admin').length,
        }));
        setDeleteLoading(prev => ({ ...prev, [userId]: false }));
      } catch (e) {
        setDeleteError(prev => ({ ...prev, [userId]: true }));
        setDeleteLoading(prev => ({ ...prev, [userId]: false }));
      }
    }, 600);
  }

  return (
    <ProtectedRoute
      allowedRoles={['admin']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
            <a href="/" className="text-blue-600 hover:underline">Go Home</a>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
        <Navbar user={session} onLogout={handleLogout} onNavigate={handleNavigate} />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          {error && (
            <div className="mb-4 text-red-500">{error}</div>
          )}
          {/* Stats */}
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard
                label="Total Users"
                value={stats.users}
                loading={loadingStats}
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-9a4 4 0 11-8 0 4 4 0 018 0zM23 7a4 4 0 11-8 0 4 4 0 018 0zM7 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Admins"
                value={stats.admins}
                loading={loadingStats}
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a8.38 8.38 0 0113 0"/>
                  </svg>
                }
              />
              <StatCard
                label="Total Posts"
                value={stats.posts}
                loading={loadingStats}
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4" />
                  </svg>
                }
              />
            </div>
          </section>
          {/* Quick Actions */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                onClick={() => handleNavigate('/new')}
                type="button"
              >
                New Post
              </button>
              <button
                className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition-colors"
                onClick={() => handleNavigate('/my-posts')}
                type="button"
              >
                My Posts
              </button>
              <button
                className="px-5 py-2 rounded-md bg-red-100 text-red-700 font-semibold shadow hover:bg-red-200 transition-colors"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          </section>
          {/* Recent Posts */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Posts</h2>
            {loadingPosts ? (
              <div className="flex flex-col gap-4">
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-gray-400 py-4">No posts yet.</div>
            ) : (
              posts
                .slice()
                .sort((a, b) => {
                  if (a.date && b.date) return new Date(b.date) - new Date(a.date);
                  return (b.id || 0) - (a.id || 0);
                })
                .slice(0, 3)
                .map(post => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    author={{ name: post.author || 'Anonymous', role: post.role || 'user' }}
                    owned={session && post.author === session.username}
                  />
                ))
            )}
          </section>
          {/* User Management */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">User Management</h2>
            {loadingUsers ? (
              <div className="flex flex-col gap-2">
                <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-gray-400 py-4">No users found.</div>
            ) : (
              users
                .slice()
                .sort((a, b) => (a.role === 'admin' ? -1 : 1))
                .map(user => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onDelete={handleDeleteUser}
                    loading={!!deleteLoading[user.id]}
                    error={!!deleteError[user.id]}
                  />
                ))
            )}
            <div className="mt-2 text-xs text-gray-400">
              Note: You cannot delete yourself or the last admin.
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default AdminDashboard;