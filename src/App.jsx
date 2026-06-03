import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import WriteBlog from './pages/WriteBlog';
import ReadBlog from './pages/ReadBlog';
import UserManagement from './pages/UserManagement';
import Navbar from './components/Navbar';
import PublicNavbar from './components/PublicNavbar';
import { getCurrentSession, logout } from './utils/auth';

/**
 * Simple SPA router using window.location.pathname.
 * Supports navigation and reactivity.
 */
function useRoute() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    function handlePop() {
      setRoute(window.location.pathname);
    }
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  function navigate(to) {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      setRoute(to);
    }
  }

  return [route, navigate];
}

/**
 * Extracts editId from /edit/:id and blogId from /blog/:id
 * @param {string} route
 * @returns {{editId?: string, blogId?: string}}
 */
function parseParams(route) {
  const editMatch = route.match(/^\/edit\/(\d+)/);
  const blogMatch = route.match(/^\/blog\/(\d+)/);
  return {
    editId: editMatch ? editMatch[1] : undefined,
    blogId: blogMatch ? blogMatch[1] : undefined,
  };
}

function App() {
  const [route, navigate] = useRoute();
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(getCurrentSession());
    function handleSessionChange() {
      setSession(getCurrentSession());
    }
    window.addEventListener('storage', handleSessionChange);
    return () => window.removeEventListener('storage', handleSessionChange);
  }, []);

  function handleLogout() {
    logout();
    setSession(null);
    navigate('/');
  }

  function handleLoginSuccess(user) {
    setSession(user);
    navigate('/');
  }

  function handleRegisterSuccess(user) {
    setSession(user);
    navigate('/');
  }

  function handleRegisterRedirect() {
    navigate('/login');
  }

  function handleLoginRedirect() {
    navigate('/register');
  }

  // Route logic
  const { editId, blogId } = parseParams(route);

  // Navbar logic
  function renderNavbar() {
    if (
      route === '/' ||
      route === '/login' ||
      route === '/register'
    ) {
      return (
        <PublicNavbar
          onLogin={() => navigate('/login')}
          onRegister={() => navigate('/register')}
        />
      );
    }
    if (session) {
      return (
        <Navbar
          user={session}
          onLogout={handleLogout}
          onNavigate={navigate}
        />
      );
    }
    return (
      <PublicNavbar
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
    );
  }

  // Main route rendering
  let content = null;
  if (route === '/' || route === '/landing') {
    content = <LandingPage />;
  } else if (route === '/blogs' || route === '/home' || route === '/my-posts') {
    content = <Home />;
  } else if (route === '/login') {
    content = (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        navigate={navigate}
      />
    );
  } else if (route === '/register') {
    content = (
      <RegisterPage
        onRegistered={handleRegisterSuccess}
        onRedirect={handleRegisterRedirect}
      />
    );
  } else if (route === '/admin') {
    content = <AdminDashboard />;
  } else if (route === '/user-management') {
    content = <UserManagement />;
  } else if (route === '/new') {
    content = (
      <WriteBlog
        onDone={() => navigate('/my-posts')}
        navigate={navigate}
      />
    );
  } else if (editId) {
    content = (
      <WriteBlog
        editId={editId}
        onDone={() => navigate('/my-posts')}
        navigate={navigate}
      />
    );
  } else if (blogId) {
    content = (
      <ReadBlog
        navigate={navigate}
      />
    );
  } else {
    content = (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-4">Sorry, the page you requested does not exist.</p>
          <button
            className="px-5 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/')}
            type="button"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-white">
      {renderNavbar()}
      <main className="flex-1">
        {content}
      </main>
    </div>
  );
}

export default App;