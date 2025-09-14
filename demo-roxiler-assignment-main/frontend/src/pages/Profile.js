import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, updatePassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updatePassword(data.password);

    if (result.success) {
      setSuccess('Password updated successfully!');
      reset();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'store_owner':
        return '🏪';
      case 'user':
        return '👤';
      default:
        return '👤';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'System Administrator';
      case 'store_owner':
        return 'Store Owner';
      case 'user':
        return 'Regular User';
      default:
        return role;
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">👤 User Profile</h1>
        <p className="text-secondary text-center">
          Manage your account information and settings
        </p>
      </div>

      <div className="row">
        {/* Personal Information Card */}
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📋 Personal Information</h3>
            </div>
            <div className="card-body">
              <div className="text-center" style={{ marginBottom: '2rem' }}>
                <div className="nav-user-avatar" style={{
                  width: '80px',
                  height: '80px',
                  fontSize: '2rem',
                  margin: '0 auto 1rem auto'
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{user?.name}</h4>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--bg-light)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {getRoleIcon(user?.role)} {getRoleDisplayName(user?.role)}
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--border-radius)' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                      📧 Email Address
                    </label>
                    <p className="text-primary" style={{ fontWeight: '600', margin: 0 }}>
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="col">
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--border-radius)' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                      📍 Address
                    </label>
                    <p className="text-secondary" style={{ margin: 0 }}>
                      {user?.address || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgba(52, 152, 219, 0.2)'
              }}>
                <h5 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                  ℹ️ Account Status
                </h5>
                <p className="text-secondary" style={{ margin: 0, fontSize: '0.9rem' }}>
                  Your account is active and verified. You have full access to all features available for your role.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Update Card */}
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🔒 Security Settings</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="message message-error">
                  <strong>Update Failed:</strong> {error}
                </div>
              )}

              {success && (
                <div className="message message-success">
                  <strong>Success!</strong> {success}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    🔑 New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    placeholder="Enter your new password"
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
                    Password must be 8-16 characters with at least one uppercase letter and one special character
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
                        Updating Password...
                      </>
                    ) : (
                      '🔄 Update Password'
                    )}
                  </button>
                </div>
              </form>

              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid rgba(255, 193, 7, 0.3)'
              }}>
                <h6 style={{ marginBottom: '0.5rem', color: 'var(--warning-color)' }}>
                  ⚠️ Security Tips
                </h6>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <li>Use a strong, unique password</li>
                  <li>Don't share your password with others</li>
                  <li>Update your password regularly</li>
                  <li>Log out from shared devices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
