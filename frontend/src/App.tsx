import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProfileSelector from './components/profile/ProfileSelector';
import BrowsePage from './pages/BrowsePage';
import WatchlistPage from './pages/WatchlistPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Profile Required Route Component
const ProfileRequiredRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentProfile, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!currentProfile) {
    return <Navigate to="/profiles" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, currentProfile } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/profiles" replace /> : <LoginForm />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/profiles" replace /> : <RegisterForm />
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/profiles" 
        element={
          <ProtectedRoute>
            <ProfileSelector />
          </ProtectedRoute>
        } 
      />

      {/* Profile Required Routes */}
      <Route 
        path="/browse" 
        element={
          <ProfileRequiredRoute>
            <BrowsePage />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/watchlist" 
        element={
          <ProfileRequiredRoute>
            <WatchlistPage />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <ProfileRequiredRoute>
            <HistoryPage />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />

      {/* Redirects */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={
              isAuthenticated 
                ? currentProfile 
                  ? "/browse" 
                  : "/profiles"
                : "/login"
            } 
            replace 
          />
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;