// src/hooks/useSecureFetch.jsx
import { useAuth } from '../contexts/AuthContext';

const useSecureFetch = () => {
  const { token, logout } = useAuth();

  const secureFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      logout();
      return null;
    }

    return response;
  };

  return secureFetch;
};

export default useSecureFetch;
