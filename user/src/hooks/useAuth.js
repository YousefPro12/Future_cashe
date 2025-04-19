import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, verifyEmail, forgotPassword, resetPassword, clearAuthError } from '../store/slices/authSlice';

/**
 * Custom hook for authentication-related functionality
 * @returns {Object} Authentication utilities and state
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  /**
   * Login a user
   * @param {Object} credentials - User login credentials (email, password)
   * @returns {Promise} Result of login operation
   */
  const handleLogin = useCallback(
    async (credentials) => {
      try {
        // Clear any existing errors first
        dispatch(clearAuthError());
        const result = await dispatch(login(credentials)).unwrap();
        
        // Only navigate if we have a token and user data
        if (result.token && result.user) {
          navigate('/dashboard');
          return result;
        }
        
        throw new Error('Invalid login response');
      } catch (error) {
        // Let component handle the error
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Register a new user
   * @param {Object} userData - User registration data (email, password, fullname, referral_code)
   * @returns {Promise} Result of registration operation
   */
  const handleRegister = useCallback(
    async (userData) => {
      try {
        const result = await dispatch(register(userData)).unwrap();
        // On successful registration, navigate to verification page
        navigate('/verify-email');
        return result;
      } catch (error) {
        // Let component handle the error
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Verify a user's email with verification code
   * @param {Object} verificationData - Email verification data (email, otp)
   * @returns {Promise} Result of verification operation
   */
  const handleVerifyEmail = useCallback(
    async (verificationData) => {
      try {
        const result = await dispatch(verifyEmail(verificationData)).unwrap();
        
        // After successful verification, redirect to login
        // This matches the backend behavior where verification doesn't log user in
        navigate('/login');
        
        return result;
      } catch (error) {
        // Let component handle the error
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Request password reset email
   * @param {string} email - User's email address
   * @returns {Promise} Result of forgot password operation
   */
  const handleForgotPassword = useCallback(
    async (email) => {
      try {
        const result = await dispatch(forgotPassword(email)).unwrap();
        return result;
      } catch (error) {
        // Let component handle the error
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Reset user's password
   * @param {Object} resetData - Password reset data (email, otp, newPassword)
   * @returns {Promise} Result of reset password operation
   */
  const handleResetPassword = useCallback(
    async (resetData) => {
      try {
        const result = await dispatch(resetPassword(resetData)).unwrap();
        // Navigate to login on successful reset
        navigate('/login');
        return result;
      } catch (error) {
        // Let component handle the error
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Logout the current user
   */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    verificationSent: auth.verificationSent,
    resetEmailSent: auth.resetEmailSent,
    userId: auth.userId,
    userEmail: auth.userEmail,
    login: handleLogin,
    register: handleRegister,
    verifyEmail: handleVerifyEmail,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    logout: handleLogout,
    clearError: () => dispatch(clearAuthError()),
  };
};

export default useAuth; 