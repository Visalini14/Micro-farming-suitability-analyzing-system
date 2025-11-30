import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const safeNavigate = (path, options) => {
    // Always navigate when explicitly clicked, even to same path
    try {
      // Use timeout to ensure navigation happens after any state updates
      setTimeout(() => navigate(path, options), 10);
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    safeNavigate('/login');
  };

  const handleDashboard = () => {
    safeNavigate('/dashboard');
  };

  const handleHome = () => {
    safeNavigate('/');
  };

  const handleUpload = () => {
    safeNavigate('/upload');
  };

  const handleLogin = () => {
    localStorage.clear();
    sessionStorage.clear();
    safeNavigate('/login');
  };

  const handleSignup = () => {
    safeNavigate('/signup');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <button onClick={handleHome} className="nav-logo" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          🌱 PlantAI
        </button>
        <div className="nav-links">
          {user ? (
            <>
              <button onClick={handleDashboard} className="btn-outline" type="button">
                My Dashboard
              </button>
              <button onClick={handleUpload} className="btn-outline" type="button">
                New Analysis
              </button>
              <button onClick={handleLogout} className="btn-outline" type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleLogin} className="btn-outline" type="button">
                Login
              </button>
              <button onClick={handleSignup} className="btn-primary" type="button">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;