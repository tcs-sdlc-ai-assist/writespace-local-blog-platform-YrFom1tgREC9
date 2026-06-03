import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BlogCard from '../components/BlogCard';
import PublicNavbar from '../components/PublicNavbar';
import { getPosts } from '../utils/storage';

function Feature({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-6 bg-white rounded-lg shadow-md">
      <div className="mb-3 text-blue-500">{icon}</div>
      <h3 className="font-semibold text-lg text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

Feature.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

function Footer() {
  return (
    <footer className="w-full mt-16 py-6 bg-gray-50 border-t">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
        <span className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} writespace</span>
        <span className="text-gray-400 text-xs mt-2 sm:mt-0">A minimal writing platform for everyone.</span>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    try {
      setLoadingPosts(true);
      const posts = getPosts();
      // Sort by date descending, fallback to id if no date
      const sorted = [...posts].sort((a, b) => {
        if (a.date && b.date) return new Date(b.date) - new Date(a.date);
        return (b.id || 0) - (a.id || 0);
      });
      setLatestPosts(sorted.slice(0, 3));
    } catch (e) {
      setLatestPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  function handleLogin() {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  }

  function handleRegister() {
    window.dispatchEvent(new CustomEvent('open-register-modal'));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
      <PublicNavbar onLogin={handleLogin} onRegister={handleRegister} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">writespace</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            A modern, distraction-free writing platform for writers, students, and professionals. Start writing instantly, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="px-8 py-3 rounded-md bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition-colors"
              onClick={handleRegister}
              type="button"
            >
              Get Started
            </button>
            <button
              className="px-8 py-3 rounded-md bg-white text-blue-600 font-semibold text-lg border border-blue-200 shadow hover:bg-blue-50 transition-colors"
              onClick={handleLogin}
              type="button"
            >
              Log In
            </button>
          </div>
        </section>
        {/* Features Section */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Why writespace?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Feature
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4" />
                </svg>
              }
              title="Minimal & Fast"
              desc="No clutter, no distractions. Just you and your words in a lightning-fast editor."
            />
            <Feature
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              }
              title="Live Preview"
              desc="See your formatted text as you type. Perfect for notes, drafts, and blogs."
            />
            <Feature
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a4 4 0 00-4 4v0" />
                </svg>
              }
              title="Accessible Anywhere"
              desc="Responsive design for desktop and mobile. Write wherever inspiration strikes."
            />
          </div>
        </section>
        {/* Latest Posts Section */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Latest Posts</h2>
          {loadingPosts ? (
            <div className="flex flex-col gap-4">
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No posts yet. Be the first to write!</div>
          ) : (
            latestPosts.map(post => (
              <BlogCard
                key={post.id}
                post={post}
                author={{ name: post.author || 'Anonymous', role: post.role || 'user' }}
                owned={false}
              />
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}