/**
 * Extract the error message from various API error formats
 * @param {Error|Object} error - The error object
 * @returns {string} Formatted error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle axios error response
  if (error.response && error.response.data) {
    const { data } = error.response;
    
    // API returns error as { message: 'error text' }
    if (data.message) return data.message;
    
    // API returns error as { error: 'error text' }
    if (data.error) return data.error;
    
    // API returns validation errors
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => err.message || err).join('. ');
    }
    
    // If data is a string
    if (typeof data === 'string') return data;
  }
  
  // Handle error object with message property
  if (error.message) return error.message;
  
  // Handle string error
  if (typeof error === 'string') return error;
  
  // Default fallback
  return 'An unexpected error occurred';
};

/**
 * Check if error is an auth error (401)
 * @param {Error|Object} error - The error object 
 * @returns {boolean} True if auth error
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

/**
 * Check if error is a validation error (400)
 * @param {Error|Object} error - The error object
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error?.response?.status === 400 && 
    error?.response?.data?.errors && 
    Array.isArray(error?.response?.data?.errors);
};

/**
 * Extract validation errors by field
 * @param {Error|Object} error - The error object
 * @returns {Object} Field-error mapping object
 */
export const getValidationErrors = (error) => {
  const result = {};
  
  if (isValidationError(error)) {
    error.response.data.errors.forEach(err => {
      if (err.field) {
        result[err.field] = err.message;
      }
    });
  }
  
  return result;
};