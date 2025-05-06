import { lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { routes } from './routesConfig';

// Layout components
import MainLayout from './components/Layout/MainLayout';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Earn = lazy(() => import('./pages/Earn'));
const Profile = lazy(() => import('./pages/Profile'));

/**
 * Auth guard - redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

/**
 * Public route - redirects to dashboard if already logged in
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to={routes.dashboard.path} replace />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
      
      {/* Auth routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />
      
      <Route path="/verify-email" element={
        <PublicRoute>
          <VerifyEmail />
        </PublicRoute>
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/earn" element={
        <ProtectedRoute>
          <MainLayout>
            <Earn />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout>
            <Profile />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Add routes for all main navigation items */}
      {Object.values(routes)
        .filter(route => !['dashboard', 'earn'].includes(route.path.replace('/', '')))
        .map(route => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  {/* Placeholder for now - would need to import actual components */}
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h1 className="text-2xl font-bold mb-4">{route.label}</h1>
                    <p>This page is under construction.</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } 
          />
        ))
      }
      
      {/* Redirect from catch-all to 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;