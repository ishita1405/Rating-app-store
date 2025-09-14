import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isStoreOwner } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getNavItems = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/home"
            className={`nav-link ${isActiveLink('/home') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/login"
            className={`nav-link ${isActiveLink('/login') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`nav-link btn-register ${isActiveLink('/register') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Link>
        </>
      );
    }

    return (
      <>
        <div className="nav-user-info">
          <div className="nav-user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="nav-user-details">
            <span className="nav-user-name">{user?.name}</span>
            <span className="nav-user-role">{user?.role?.replace('_', ' ')}</span>
          </div>
        </div>

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className={`nav-link ${isActiveLink('/admin') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="nav-icon">⚙️</span>
            Admin Dashboard
          </Link>
        )}

        {isStoreOwner && (
          <Link
            to="/store-owner/dashboard"
            className={`nav-link ${isActiveLink('/store-owner') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="nav-icon">🏪</span>
            Store Dashboard
          </Link>
        )}

        {user?.role === 'user' && (
          <Link
            to="/stores"
            className={`nav-link ${isActiveLink('/stores') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="nav-icon">🏬</span>
            Stores
          </Link>
        )}

        <Link
          to="/profile"
          className={`nav-link ${isActiveLink('/profile') ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="nav-icon">👤</span>
          Profile
        </Link>

        <button onClick={handleLogout} className="nav-link logout-btn">
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">⭐</span>
          <span className="logo-text">Store Rating System</span>
        </Link>

        <button
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {getNavItems()}
        </div>

        {isMenuOpen && <div className="nav-overlay" onClick={() => setIsMenuOpen(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;
