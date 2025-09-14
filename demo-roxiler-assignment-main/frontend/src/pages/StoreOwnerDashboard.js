import React, { useState, useEffect } from 'react';
import { storeService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyStore();
  }, []);

  const fetchMyStore = async () => {
    setLoading(true);
    try {
      const result = await storeService.getMyStore();
      setStore(result.store);
    } catch (error) {
      setError('Failed to fetch store data');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'var(--success-color)';
    if (rating >= 3.5) return 'var(--warning-color)';
    if (rating >= 2.5) return 'var(--info-color)';
    return 'var(--danger-color)';
  };

  const getRatingDescription = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    return 'Needs Improvement';
  };

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="container">
      <div className="message message-error">
        <strong>Error:</strong> {error}
      </div>
    </div>
  );

  if (!store) return (
    <div className="container">
      <div className="text-center" style={{ padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
        <h3 className="text-secondary">No Store Found</h3>
        <p className="text-muted">No store is associated with your account.</p>
      </div>
    </div>
  );

  const averageRating = store.average_rating ? Number(store.average_rating) : 0;

  return (
    <div className="container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">🏪 Store Dashboard</h1>
        <p className="text-secondary text-center">
          Manage your store and view customer feedback
        </p>
      </div>

      {/* Store Overview */}
      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📊 Store Overview</h3>
            </div>
            <div className="card-body">
              <div className="text-center" style={{ marginBottom: '2rem' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  margin: '0 auto 1rem auto'
                }}>
                  🏪
                </div>
                <h2 style={{ marginBottom: '0.5rem' }}>{store.name}</h2>
                <p className="text-secondary">Your Store</p>
              </div>

              <div className="row">
                <div className="col">
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg-light)',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '1rem'
                  }}>
                    <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      📍 Location
                    </h5>
                    <p className="text-secondary" style={{ margin: 0 }}>
                      {store.address}
                    </p>
                  </div>
                </div>

                <div className="col">
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg-light)',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '1rem'
                  }}>
                    <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      📧 Contact
                    </h5>
                    <p className="text-secondary" style={{ margin: 0 }}>
                      {store.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">⭐ Rating Analytics</h3>
            </div>
            <div className="card-body text-center">
              <div style={{
                fontSize: '3rem',
                fontWeight: '900',
                color: getRatingColor(averageRating),
                marginBottom: '0.5rem'
              }}>
                {averageRating ? averageRating.toFixed(1) : 'N/A'}
              </div>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⭐</div>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: `${getRatingColor(averageRating)}15`,
                color: getRatingColor(averageRating),
                borderRadius: 'var(--border-radius)',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {averageRating ? getRatingDescription(averageRating) : 'No Ratings'}
              </div>
              <p className="text-secondary">
                Based on {store.total_ratings} customer review{store.total_ratings !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">💬 Customer Reviews</h3>
        </div>
        <div className="card-body">
          {store.ratings && store.ratings.length > 0 ? (
            <div className="row">
              {store.ratings.map((rating) => (
                <div key={rating.id} className="col" style={{ marginBottom: '1rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--bg-light)',
                    borderRadius: 'var(--border-radius-lg)',
                    border: '1px solid var(--border-color)',
                    height: '100%'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="nav-user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                          {rating.user_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <strong>{rating.user_name}</strong>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getRatingColor(rating.rating) + '15',
                        color: getRatingColor(rating.rating),
                        borderRadius: 'var(--border-radius)',
                        fontWeight: '700'
                      }}>
                        {rating.rating} ⭐
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      textAlign: 'right'
                    }}>
                      {new Date(rating.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h3 className="text-secondary">No Reviews Yet</h3>
              <p className="text-muted">
                Your store hasn't received any customer ratings yet. Encourage customers to leave reviews!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">💡 Tips to Improve Your Rating</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                <h5>Provide Excellent Service</h5>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                  Focus on customer satisfaction and quality service delivery
                </p>
              </div>
            </div>
            <div className="col">
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤝</div>
                <h5>Engage with Customers</h5>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                  Build relationships and respond to customer feedback promptly
                </p>
              </div>
            </div>
            <div className="col">
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
                <h5>Continuous Improvement</h5>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                  Learn from reviews and constantly improve your services
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
