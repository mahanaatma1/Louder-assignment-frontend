// Base URL configuration - points to the backend server

const getBaseUrl = () => {
  // Use backend server URL from environment or default
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://louder-assignment-backend.onrender.com';
  }
  
  // Client-side: use environment variable or default backend URL
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://louder-assignment-backend.onrender.com';
};

export const BASE_URL = getBaseUrl();

export default BASE_URL;

