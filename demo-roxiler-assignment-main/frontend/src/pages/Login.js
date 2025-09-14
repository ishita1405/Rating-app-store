
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const result = await login(data.email, data.password);

    if (result.success) {
      // Redirect based on role
      const userRole = result.data.user.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'store_owner') {
        navigate('/store-owner/dashboard');
      } else {
        navigate('/stores');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
          <h1 className="form-title">Welcome Back</h1>
          <p className="text-secondary">Sign in to your Store Rating account</p>
        </div>

        {error && (
          <div className="message message-error">
            <strong>Login Failed:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-large w-full"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-secondary">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary"
              style={{ textDecoration: 'none', fontWeight: '600' }}
            >
              Create one here
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="btn btn-outline btn-small">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
