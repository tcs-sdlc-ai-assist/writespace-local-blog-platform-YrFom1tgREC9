import React from 'react';
import PropTypes from 'prop-types';
import Avatar, { getAvatar } from './Avatar';

/**
 * BlogCard component displays a blog post summary with accent border,
 * author avatar, title, snippet, and edit icon if owned by current user.
 * @param {object} props
 * @param {object} props.post - Blog post object
 * @param {object} props.author - Author user object
 * @param {boolean} props.owned - Whether current user owns the post
 * @param {function} [props.onEdit] - Edit handler (optional)
 * @returns {JSX.Element}
 */
function BlogCard({ post, author, owned, onEdit }) {
  return (
    <div className="relative flex flex-col bg-white rounded-lg shadow-md border-l-4 border-blue-500 p-5 mb-4 transition hover:shadow-lg">
      <div className="flex items-center mb-2">
        <div className="mr-3">
          {getAvatar(author?.role || 'default')}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{author?.name || 'Unknown'}</span>
          <span className="text-xs text-gray-400">{author?.role || 'user'}</span>
        </div>
        {owned && (
          <button
            className="ml-auto p-2 rounded-full hover:bg-blue-100 transition-colors"
            title="Edit post"
            onClick={onEdit}
            type="button"
          >
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232a3 3 0 014.242 4.242l-9.192 9.192a4 4 0 01-1.414 0l-3.535-3.535a4 4 0 010-1.414l9.192-9.192z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7l1 1"/>
            </svg>
          </button>
        )}
      </div>
      <div className="mt-2">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">{post.snippet || post.content?.slice(0, 120) || ''}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">{post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
        {post.tags && Array.isArray(post.tags) && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    snippet: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  author: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
  owned: PropTypes.bool,
  onEdit: PropTypes.func,
};

BlogCard.defaultProps = {
  author: { name: 'Unknown', role: 'user' },
  owned: false,
  onEdit: undefined,
};

export default BlogCard;