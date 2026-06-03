import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import { getPosts, getSession } from '../utils/storage';

/**
 * Home page: Blog list at /blogs.
 * Responsive grid, ownership-based controls, empty state CTA.
 */
function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError('');
      const allPosts = getPosts();
      setPosts(Array.isArray(allPosts) ? allPosts : []);
      setSession(getSession());
    } catch (e) {
      setError('Failed to load posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleEdit(postId) {
    window.location.href = `/edit/${postId}`;
  }

  function handleNewPost() {
    window.location.href = '/new';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">All Blogs</h1>
          {session && (
            <button
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
              onClick={handleNewPost}
              type="button"
            >
              + New Post
            </button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-36 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-36 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-36 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-4">
              <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
                <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 20h16M16 28h8" />
              </svg>
            </div>
            <div className="text-gray-500 text-lg mb-4">No blog posts yet.</div>
            {session ? (
              <button
                className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                onClick={handleNewPost}
                type="button"
              >
                Write your first post
              </button>
            ) : (
              <span className="text-gray-400 text-sm">Sign in to start writing!</span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts
              .sort((a, b) => {
                if (a.date && b.date) return new Date(b.date) - new Date(a.date);
                return (b.id || 0) - (a.id || 0);
              })
              .map(post => (
                <BlogCard
                  key={post.id}
                  post={post}
                  author={{ name: post.author || 'Anonymous', role: post.role || 'user' }}
                  owned={session && session.username === post.author}
                  onEdit={session && session.username === post.author ? () => handleEdit(post.id) : undefined}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;