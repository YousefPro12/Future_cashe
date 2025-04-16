import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api';

/**
 * Custom hook for making API calls with loading and error handling
 * @returns {Object} API utilities and state
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  /**
   * Execute API call with loading and error state management
   * @param {Function} apiCall - The API function to call
   * @param {Array} params - Parameters to pass to the API function
   * @param {Function} [onSuccess] - Callback on successful API call
   * @param {Function} [onError] - Callback on API error
   * @param {Function} [dispatchAction] - Redux action to dispatch with result
   * @returns {Promise} - The API call result
   */
  const callApi = useCallback(
    async (apiCall, params = [], onSuccess = null, onError = null, dispatchAction = null) => {
      setLoading(true);
      setError(null);
      
      try {
        // Get the API method from the path
        const apiMethod = params.length ? 
          (...args) => apiCall(...args) : 
          () => apiCall();
        
        // Call the API
        const result = params.length ? 
          await apiMethod(...params) : 
          await apiMethod();
        
        // Handle success
        if (onSuccess) {
          onSuccess(result);
        }
        
        // Dispatch Redux action if provided
        if (dispatchAction) {
          dispatch(dispatchAction(result));
        }
        
        setLoading(false);
        return result;
      } catch (err) {
        // Extract error message
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        
        // Set error state
        setError(errorMessage);
        
        // Handle error
        if (onError) {
          onError(errorMessage, err);
        }
        
        setLoading(false);
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Clear current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};

export default useApi; 