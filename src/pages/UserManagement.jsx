import React, { useState, useEffect } from 'react';
import UserRow from '../components/UserRow';
import { getUsers, setUsers } from '../utils/storage';

/**
 * UserManagement page for admin user management.
 * Allows viewing all users, deleting users, and shows responsive UI.
 * Only accessible to admins (should be wrapped in ProtectedRoute).
 */
function UserManagement() {
  const [users, setUsersState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteError, setDeleteError] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setLoading(true);
      const allUsers = getUsers();
      setUsersState(allUsers);
    } catch (e) {
      setError('Failed to load users.');
      setUsersState([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleDelete(userId) {
    setDeleteLoading(prev => ({ ...prev, [userId]: true }));
    setDeleteError(prev => ({ ...prev, [userId]: false }));
    setTimeout(() => {
      try {
        const allUsers = getUsers();
        const user = allUsers.find(u => u.id === userId);
        if (!user) {
          setDeleteError(prev => ({ ...prev, [userId]: true }));
          setDeleteLoading(prev => ({ ...prev, [userId]: false }));
          return;
        }
        // Prevent deleting last admin
        if (user.role === 'admin') {
          const adminCount = allUsers.filter(u => u.role === 'admin').length;
          if (adminCount <= 1) {
            setDeleteError(prev => ({ ...prev, [userId]: true }));
            setDeleteLoading(prev => ({ ...prev, [userId]: false }));
            setError('Cannot delete the last admin user.');
            return;
          }
        }
        const filtered = allUsers.filter(u => u.id !== userId);
        setUsers(filtered);
        setUsersState(filtered);
        setDeleteLoading(prev => ({ ...prev, [userId]: false }));
      } catch (e) {
        setDeleteError(prev => ({ ...prev, [userId]: true }));
        setDeleteLoading(prev => ({ ...prev, [userId]: false }));
      }
    }, 400);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">User Management</h1>
      <div className="mb-4 text-gray-500 text-center text-sm">
        Manage all users. Only admins can access this page.
      </div>
      {error && (
        <div className="mb-4 text-red-500 text-center">{error}</div>
      )}
      {loading ? (
        <div className="flex flex-col gap-3">
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No users found.</div>
      ) : (
        <div>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onDelete={handleDelete}
              loading={!!deleteLoading[user.id]}
              error={!!deleteError[user.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserManagement;