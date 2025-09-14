import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-icon">🚫</div>
        <h1 className="error-title">Access Denied</h1>
        <p className="error-description">
          You don't have permission to access this page. Please check your account
          permissions or contact an administrator if you believe this is an error.
        </p>

        <div className="error-actions">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
