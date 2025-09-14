import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-icon">🔍</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-description">
          The page you're looking for doesn't exist. It might have been moved,
          deleted, or you entered the wrong URL.
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

export default NotFound;
