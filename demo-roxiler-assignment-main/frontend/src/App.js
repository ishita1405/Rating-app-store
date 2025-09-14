import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better performance
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Stores = React.lazy(() => import('./pages/Stores'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const StoreOwnerDashboard = React.lazy(() => import('./pages/StoreOwnerDashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Home = React.lazy(() => import('./pages/Home'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Default redirect logic based on user role
  const getDefaultRedirect = () => {
    if (!isAuthenticated) return '/login';

    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'store_owner':
        return '/store-owner/dashboard';
      case 'user':
        return '/stores';
      default:
        return '/login';
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes - accessible to everyone */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRedirect()} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRedirect()} replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/stores"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Stores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/store-owner/*"
          element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <Routes>
                <Route path="dashboard" element={<StoreOwnerDashboard />} />
                <Route path="" element={<Navigate to="/store-owner/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Error pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
