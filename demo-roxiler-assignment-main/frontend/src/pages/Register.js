import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await registerUser(data);

    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
          <h1 className="form-title">Create Account</h1>
          <p className="text-secondary">Join our Store Rating community</p>
        </div>

        {error && (
          <div className="message message-error">
            <strong>Registration Failed:</strong> {error}
          </div>
        )}

        {success && (
          <div className="message message-success">
            <strong>Success!</strong> {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Enter your full name (20-60 characters)"
              autoComplete="name"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 20,
                  message: 'Name must be at least 20 characters',
                },
                maxLength: {
                  value: 60,
                  message: 'Name must not exceed 60 characters',
                },
              })}
            />
            {errors.name && (
              <span className="form-error">{errors.name.message}</span>
            )}
            <div className="form-help">
              Full name should be 20-60 characters long
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email address"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              className="form-textarea"
              rows="3"
              placeholder="Enter your address (optional, max 400 characters)"
              {...register('address', {
                maxLength: {
                  value: 400,
                  message: 'Address must not exceed 400 characters',
                },
              })}
            />
            {errors.address && (
              <span className="form-error">{errors.address.message}</span>
            )}
            <div className="form-help">
              Optional field, maximum 400 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                maxLength: {
                  value: 16,
                  message: 'Password must not exceed 16 characters',
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
                  message: 'Password must contain at least one uppercase letter and one special character',
                },
              })}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
            <div className="form-help">
              8-16 characters with at least one uppercase letter and one special character
            </div>
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary"
              style={{ textDecoration: 'none', fontWeight: '600' }}
            >
              Sign in here
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

export default Register;
