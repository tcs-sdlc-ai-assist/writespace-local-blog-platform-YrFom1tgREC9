import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BlogCard from '../components/BlogCard';
import Navbar from '../components/Navbar';
import PublicNavbar from '../components/PublicNavbar';
import { getPosts, setPosts } from '../utils/storage';
import { getCurrentSession, logout } from '../utils/auth';

/**
 * Extracts the blog post ID from the URL path.
 * Supports /blog/:id and /blog/:id/
 * @returns {string|null}
 */
function useBlogId() {
  const [blogId, setBlogId] = useState(null);

  useEffect(() => {
    function extractId() {
      const path = window.location.pathname;
      // Match /blog/:id or /blog/:id/
      const match = path.match(/^\/blog\/(\d+)/);
      if (match && match[1]) {
        setBlogId(match[1]);
      } else {
        setBlogId(null);
      }
    }
    extractId();
    window.addEventListener('popstate', extractId);
    return () => window.removeEventListener('popstate', extractId);
  }, []);

  return blogId;
}

/**
 * Renders the full blog post reader page.
 * @param {object} props
 * @param {function} [props.navigate] - Optional navigation function for SPA
 */
function ReadBlog({ navigate }) {
  const blogId = useBlogId();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [session, setSession] = useState(null);
  const [deleteState, setDeleteState] = useState({ loading: false, error: '' });

  useEffect(() => {
    setSession(getCurrentSession());
  }, []);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    if (!blogId) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    try {
      const posts = getPosts();
      const found = posts.find(p => String(p.id) === String(blogId));
      if (!found) {
        setNotFound(true);
        setPost(null);
      } else {
        setPost(found);
      }
    } catch (err) {
      setNotFound(true);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  function handleLogout() {
    logout();
    setSession(null);
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
  }

  function handleEdit() {
    if (navigate) {
      navigate(`/edit/${post.id}`);
    } else {
      window.location.href = `/edit/${post.id}`;
    }
  }

  function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeleteState({ loading: true, error: '' });
    try {
      const posts = getPosts();
      const idx = posts.findIndex(p => String(p.id) === String(post.id));
      if (idx === -1) {
        setDeleteState({ loading: false, error: 'Post not found.' });
        return;
      }
      posts.splice(idx, 1);
      setPosts(posts);
      setDeleteState({ loading: false, error: '' });
      if (navigate) {
        navigate('/');
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setDeleteState({ loading: false, error: 'Failed to delete post.' });
    }
  }

  // Ownership: user is author or admin
  const owned =
    session &&
    post &&
    (session.role === 'admin' ||
      (post.authorId && String(post.authorId) === String(session.id)) ||
      (post.author && post.author === session.username));

  // Author info for BlogCard
  const author = {
    name: post?.author || 'Unknown',
    role: post?.role || 'user',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
      {session ? (
        <Navbar user={session} onLogout={handleLogout} onNavigate={navigate} />
      ) : (
        <PublicNavbar
          onLogin={() => (navigate ? navigate('/login') : (window.location.href = '/login'))}
          onRegister={() => (navigate ? navigate('/register') : (window.location.href = '/register'))}
        />
      )}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        {loading ? (
          <div className="mt-20 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-blue-500 font-semibold">Loading post...</div>
          </div>
        ) : notFound ? (
          <div className="mt-20 flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.01M15 9h.01M9 15c1.5 1 4.5 1 6 0" />
            </svg>
            <div className="text-gray-500 text-lg font-semibold mb-2">Post not found</div>
            <button
              className="px-5 py-2 mt-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              onClick={() => (navigate ? navigate('/') : (window.location.href = '/'))}
              type="button"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <article className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <BlogCard post={post} author={author} owned={owned} onEdit={handleEdit} />
            </div>
            <div className="prose max-w-none text-gray-900 text-lg mb-8 whitespace-pre-line">
              {post.content}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {post.tags &&
                  Array.isArray(post.tags) &&
                  post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">{tag}</span>
                  ))}
              </div>
              {owned && (
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                    onClick={handleEdit}
                    type="button"
                    disabled={deleteState.loading}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                      deleteState.loading
                        ? 'bg-red-300 text-white cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    onClick={handleDelete}
                    type="button"
                    disabled={deleteState.loading}
                  >
                    {deleteState.loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle mr-2" />
                    ) : null}
                    Delete
                  </button>
                </div>
              )}
            </div>
            {deleteState.error && (
              <div className="mt-4 text-red-500 text-sm">{deleteState.error}</div>
            )}
          </article>
        )}
      </main>
    </div>
  );
}

ReadBlog.propTypes = {
  navigate: PropTypes.func,
};

export default ReadBlog;