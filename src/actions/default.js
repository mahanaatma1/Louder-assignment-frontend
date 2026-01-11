// Default Actions - common/default action handlers

// default error handler
export const handleError = (error) => {
  console.error('Action error:', error);
  return {
    success: false,
    error: error.message || 'An error occurred',
  };
};

// default success handler
export const handleSuccess = (data) => {
  return {
    success: true,
    data,
  };
};

