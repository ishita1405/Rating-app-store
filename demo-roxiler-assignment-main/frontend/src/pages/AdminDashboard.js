import React, { useState, useEffect } from 'react';
import { adminService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateStoreForm, setShowCreateStoreForm] = useState(false);
  const [createUserData, setCreateUserData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  const [createStoreData, setCreateStoreData] = useState({
    name: '',
    email: '',
    address: '',
    owner_email: ''
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'stores') {
      fetchStores();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await adminService.getDashboardStats();
      setStats(result.stats);
    } catch (error) {
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllUsers();
      setUsers(result.users);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllStores();
      setStores(result.stores);
    } catch (error) {
      setError('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      try {
        await adminService.deleteStore(storeId);
        fetchStores();
      } catch (error) {
        alert('Failed to delete store');
      }
    }
  };

  const validateUserForm = (userData) => {
    const errors = [];

    if (!userData.name || userData.name.length < 20 || userData.name.length > 60) {
      errors.push('Name must be between 20-60 characters');
    }

    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push('Please provide a valid email');
    }

    if (!userData.password || userData.password.length < 8 || userData.password.length > 16) {
      errors.push('Password must be between 8-16 characters');
    }

    if (userData.password && (!/[A-Z]/.test(userData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(userData.password))) {
      errors.push('Password must contain at least one uppercase letter and one special character');
    }

    if (userData.address && userData.address.length > 400) {
      errors.push('Address must not exceed 400 characters');
    }

    return errors;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const validationErrors = validateUserForm(createUserData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);
    try {
      await adminService.createUser(createUserData);
      setShowCreateUserForm(false);
      setCreateUserData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
      });
      fetchUsers();
      alert('User created successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      const validationErrors = error.response?.data?.errors;

      if (validationErrors && validationErrors.length > 0) {
        const errorList = validationErrors.map(err => err.msg).join(', ');
        setError(`Validation failed: ${errorList}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminService.createStore(createStoreData);
      setShowCreateStoreForm(false);
      setCreateStoreData({
        name: '',
        email: '',
        address: '',
        owner_email: ''
      });
      fetchStores();
      alert('Store created successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create store';
      const validationErrors = error.response?.data?.errors;

      if (validationErrors && validationErrors.length > 0) {
        const errorList = validationErrors.map(err => err.msg).join(', ');
        setError(`Validation failed: ${errorList}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">📊 Dashboard Overview</h2>
        <p className="text-secondary text-center">
          Real-time statistics and insights
        </p>
      </div>

      {stats && (
        <>
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-body text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
                  <h3 className="card-title">Total Users</h3>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)', margin: 0 }}>
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card">
                <div className="card-body text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏪</div>
                  <h3 className="card-title">Total Stores</h3>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-color)', margin: 0 }}>
                    {stats.totalStores}
                  </p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card">
                <div className="card-body text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</div>
                  <h3 className="card-title">Total Ratings</h3>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning-color)', margin: 0 }}>
                    {stats.totalRatings}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">👥 User Management</h2>
        <p className="text-secondary text-center">
          Manage all registered users
        </p>
      </div>

      {/* Create User Form */}
      {showCreateUserForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">➕ Create New User</h3>
          </div>
          <div className="card-body">
            <div style={{
              marginBottom: '1.5rem',
              background: '#eaf6fb',
              border: '1px solid #b3e0f7',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <strong>📋 Validation Requirements:</strong>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
                <li><strong>Name:</strong> 20-60 characters (e.g., "John Michael Smith Johnson")</li>
                <li><strong>Password:</strong> 8-16 characters with uppercase & special character (e.g., "MyPass123!")</li>
                <li><strong>Email:</strong> Valid email format</li>
                <li><strong>Address:</strong> Optional, max 400 characters</li>
              </ul>
            </div>
            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600 }}>Name *</label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                      value={createUserData.name}
                      onChange={(e) => setCreateUserData({ ...createUserData, name: e.target.value })}
                      minLength="20"
                      maxLength="60"
                      placeholder="e.g., John Michael Smith Johnson"
                      required
                    />
                    <small style={{ color: '#888' }}>
                      Name must be between 20-60 characters
                    </small>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600 }}>Email *</label>
                    <input
                      type="email"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                      value={createUserData.email}
                      onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600 }}>Password *</label>
                    <input
                      type="password"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                      value={createUserData.password}
                      onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
                      minLength="8"
                      maxLength="16"
                      placeholder="e.g., MyPass123!"
                      required
                    />
                    <small style={{ color: '#888' }}>
                      8-16 characters, must include uppercase letter and special character
                    </small>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600 }}>Role *</label>
                    <select
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                      value={createUserData.role}
                      onChange={(e) => setCreateUserData({ ...createUserData, role: e.target.value })}
                      required
                    >
                      <option value="user">👤 Regular User</option>
                      <option value="store_owner">🏪 Store Owner</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 600 }}>Address</label>
                <textarea
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  value={createUserData.address}
                  onChange={(e) => setCreateUserData({ ...createUserData, address: e.target.value })}
                  rows="3"
                  maxLength="400"
                  placeholder="Enter full address (optional)"
                />
                <small style={{ color: '#888' }}>
                  Maximum 400 characters (optional)
                </small>
              </div>

              {error && (
                <div style={{
                  marginBottom: '1rem',
                  background: '#fdecea',
                  border: '1px solid #f5c6cb',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  color: '#c0392b'
                }}>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateUserForm(false)}
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    color: '#333',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#007bff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    color: '#fff',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : '✅ Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">All Users ({users.length})</h3>
          <button
            onClick={() => setShowCreateUserForm(!showCreateUserForm)}
            className="btn btn-primary"
          >
            {showCreateUserForm ? '❌ Cancel' : '➕ Add New User'}
          </button>
        </div>
        <div className="card-body" style={{ padding: 0, overflow: 'auto' }}>
          {users.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--bg-light)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Address</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="nav-user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {user.address ? user.address.substring(0, 50) + (user.address.length > 50 ? '...' : '') : 'Not provided'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: user.role === 'admin' ? 'rgba(231, 76, 60, 0.1)' :
                          user.role === 'store_owner' ? 'rgba(52, 152, 219, 0.1)' :
                            'rgba(149, 165, 166, 0.1)',
                        color: user.role === 'admin' ? 'var(--danger-color)' :
                          user.role === 'store_owner' ? 'var(--primary-color)' :
                            'var(--text-secondary)'
                      }}>
                        {user.role === 'admin' ? '👑 Admin' :
                          user.role === 'store_owner' ? '🏪 Store Owner' :
                            '👤 User'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-danger btn-small"
                        style={{ fontSize: '0.8rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center" style={{ padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <h3 className="text-secondary">No users found</h3>
              <p className="text-muted">No users have registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStores = () => (
    <div className="stores-section">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">🏪 Store Management</h2>
        <p className="text-secondary text-center">
          Manage all registered stores
        </p>
      </div>

      {/* Create Store Form */}
      {showCreateStoreForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 className="card-title">➕ Create New Store</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateStore}>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label>Store Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={createStoreData.name}
                      onChange={(e) => setCreateStoreData({ ...createStoreData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>Store Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={createStoreData.email}
                      onChange={(e) => setCreateStoreData({ ...createStoreData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Store Address *</label>
                <textarea
                  className="form-control"
                  value={createStoreData.address}
                  onChange={(e) => setCreateStoreData({ ...createStoreData, address: e.target.value })}
                  rows="3"
                  maxLength="400"
                  placeholder="Enter full store address"
                  required
                />
                <small className="form-text text-muted">
                  Maximum 400 characters
                </small>
              </div>

              <div className="form-group">
                <label>Owner Email (Optional)</label>
                <input
                  type="email"
                  className="form-control"
                  value={createStoreData.owner_email}
                  onChange={(e) => setCreateStoreData({ ...createStoreData, owner_email: e.target.value })}
                  placeholder="Email of existing user to assign as store owner"
                />
                <small className="form-text text-muted">
                  Leave empty if no owner assignment needed. If provided, the user's role will be updated to store_owner.
                </small>
              </div>

              {error && (
                <div className="message message-error" style={{ marginBottom: '1rem' }}>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateStoreForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : '✅ Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">All Stores ({stores.length})</h3>
          <button
            onClick={() => setShowCreateStoreForm(!showCreateStoreForm)}
            className="btn btn-primary"
          >
            {showCreateStoreForm ? '❌ Cancel' : '➕ Add New Store'}
          </button>
        </div>
        <div className="card-body" style={{ padding: 0, overflow: 'auto' }}>
          {stores.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--bg-light)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Store</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Contact</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Location</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>Rating</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>Owner</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <strong>{store.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ID: {store.id}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{store.email}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {store.address ? store.address.substring(0, 50) + (store.address.length > 50 ? '...' : '') : 'Not provided'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div>
                        <strong>{store.average_rating ? Number(store.average_rating).toFixed(1) : 'N/A'}</strong> ⭐
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {store.total_ratings} rating{store.total_ratings !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {store.owner_name || 'No owner assigned'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteStore(store.id)}
                        className="btn btn-danger btn-small"
                        style={{ fontSize: '0.8rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center" style={{ padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
              <h3 className="text-secondary">No stores found</h3>
              <p className="text-muted">No stores have been registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        padding: '0.5rem',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`btn ${activeTab === 'stores' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          🏪 Stores
        </button>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        {loading && <LoadingSpinner />}

        {error && (
          <div className="message message-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'stores' && renderStores()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
