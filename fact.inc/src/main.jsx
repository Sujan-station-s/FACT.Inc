// src/main.jsx
import { AuthProvider } from './contexts/AuthContext';
import { CompanyTypeProvider } from './contexts/CompanyTypeContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter basename="/factops">
    <AuthProvider>
      <CompanyTypeProvider>
        <App />
      </CompanyTypeProvider>
    </AuthProvider>
  </BrowserRouter>
</React.StrictMode>
);