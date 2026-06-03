import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCurrentSession } from '../utils/auth';
import { getPosts, setPosts } from '../utils/storage';
import BlogCard from '../components/BlogCard';

/**
 * WriteBlog page for creating or editing a blog post.
 * Handles ownership, validation, loading, error, and redirects.
 * @param {object} props
 * @param {string|number} [props.editId] - If provided, edit mode for post with this id
 * @param {function} [props.onDone] - Callback after successful save (optional)
 * @param {function} [props.navigate] - Navigation function (optional)
 */
function WriteBlog({ editId, onDone, navigate }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const user = getCurrentSession();
    setSession(user);
    if (!user) {
      setLoading(false);
      setError('You must be logged in to write a blog post.');
      return;
    }
    if (editId) {
      setEditMode(true);
      const posts = getPosts();
      const found = posts.find(p => String(p.id) === String(editId));
      if (!found) {
        setError('Post not found.');
        setLoading(false);
        return;
      }
      // Ownership check: admin can edit any, user only their own
      if (
        user.role !== 'admin' &&
        found.author !== user.username
      ) {
        setError('You do not have permission to edit this post.');
        setLoading(false);
        return;
      }
      setPost({
        title: found.title || '',
        content: found.content || '',
        tags: Array.isArray(found.tags) ? found.tags : [],
      });
      setLoading(false);
    } else {
      setEditMode(false);
      setLoading(false);
    }
  }, [editId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleTagsChange(e) {
    const value = e.target.value;
    const tagsArr = value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    setPost(prev => ({
      ...prev,
      tags: tagsArr,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Validation
      if (!post.title.trim()) {
        setError('Title is required.');
        setSaving(false);
        return;
      }
      if (!post.content.trim()) {
        setError('Content is required.');
        setSaving(false);
        return;
      }
      const user = session;
      if (!user) {
        setError('You must be logged in.');
        setSaving(false);
        return;
      }
      const posts = getPosts();
      if (editMode) {
        // Edit existing post
        const idx = posts.findIndex(p => String(p.id) === String(editId));
        if (idx === -1) {
          setError('Post not found.');
          setSaving(false);
          return;
        }
        // Ownership check
        if (
          user.role !== 'admin' &&
          posts[idx].author !== user.username
        ) {
          setError('You do not have permission to edit this post.');
          setSaving(false);
          return;
        }
        posts[idx] = {
          ...posts[idx],
          title: post.title.trim(),
          content: post.content.trim(),
          tags: Array.isArray(post.tags) ? post.tags : [],
          date: new Date().toISOString(),
        };
        setPosts(posts);
      } else {
        // Create new post
        const newPost = {
          id: Date.now(),
          title: post.title.trim(),
          content: post.content.trim(),
          tags: Array.isArray(post.tags) ? post.tags : [],
          author: user.username,
          role: user.role,
          date: new Date().toISOString(),
        };
        posts.push(newPost);
        setPosts(posts);
      }
      setSaving(false);
      if (onDone) {
        onDone();
      }
      if (navigate) {
        navigate('/my-posts');
      }
    } catch (err) {
      setError('Unexpected error. Please try again.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow">{error}</div>
        <button
          className="mt-6 px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          type="button"
          onClick={() => {
            if (navigate) {
              navigate('/');
            } else {
              window.location.href = '/';
            }
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        {editMode ? 'Edit Blog Post' : 'Write a New Blog Post'}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8 space-y-6"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={post.title}
            onChange={handleChange}
            disabled={saving}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
            value={post.content}
            onChange={handleChange}
            disabled={saving}
            required
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-xs text-gray-400">(comma separated)</span>
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={post.tags.join(', ')}
            onChange={handleTagsChange}
            disabled={saving}
            placeholder="e.g. writing, productivity"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <button
          type="submit"
          className={`w-full py-2 rounded-md font-semibold transition-colors ${
            saving
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={saving}
        >
          {saving ? (
            <span className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
          ) : null}
          {saving ? (editMode ? 'Saving...' : 'Publishing...') : (editMode ? 'Save Changes' : 'Publish')}
        </button>
      </form>
      {/* Live Preview */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Live Preview</h2>
        <BlogCard
          post={{
            title: post.title || 'Untitled',
            content: post.content || '',
            snippet: post.content ? post.content.slice(0, 120) : '',
            tags: Array.isArray(post.tags) ? post.tags : [],
            date: new Date().toISOString(),
          }}
          author={{
            name: session?.username || 'Anonymous',
            role: session?.role || 'user',
          }}
          owned={true}
        />
      </div>
    </div>
  );
}

WriteBlog.propTypes = {
  editId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onDone: PropTypes.func,
  navigate: PropTypes.func,
};

WriteBlog.defaultProps = {
  editId: undefined,
  onDone: undefined,
  navigate: undefined,
};

export default WriteBlog;