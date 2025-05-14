import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => sessionStorage.getItem("access_token") || null);
  const [orgId, setOrgId] = useState(() => sessionStorage.getItem("org_id") || null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("access_token");
    if (storedToken && isTokenExpired(storedToken)) {
      logout(); // token expired
    }
  }, []);

  const login = (accessToken, organizationId) => {
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("org_id", organizationId);
    setToken(accessToken);
    setOrgId(organizationId);
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("org_id");
    setToken(null);
    setOrgId(null);
    navigate("/"); // or "/login"
  };

  return (
    <AuthContext.Provider value={{ token, orgId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
