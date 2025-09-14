import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      switch (user?.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'store_owner':
          navigate('/store-owner/dashboard');
          break;
        case 'user':
          navigate('/stores');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Store Rating System
          </h1>
          <p className="hero-subtitle">
            Discover, rate, and review stores in your area. Help others make informed decisions
            while sharing your experiences with local businesses.
          </p>

          <div className="hero-actions">
            <button onClick={handleGetStarted} className="btn btn-primary btn-large">
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
            {!isAuthenticated && (
              <button onClick={() => navigate('/login')} className="btn btn-secondary btn-large">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏪</div>
              <h3>Discover Stores</h3>
              <p>Find and explore stores in your area with detailed information and ratings.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Rate & Review</h3>
              <p>Share your experience by rating stores on a scale of 1 to 5 stars.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Store owners can track their ratings and customer feedback in real-time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure & Reliable</h3>
              <p>Your data is protected with industry-standard security measures.</p>
            </div>
          </div>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of users who trust our platform for store ratings and reviews.</p>
              <div className="cta-actions">
                <button onClick={() => navigate('/register')} className="btn btn-primary">
                  Create Account
                </button>
                <button onClick={() => navigate('/login')} className="btn btn-outline">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
