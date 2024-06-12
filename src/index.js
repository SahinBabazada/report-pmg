import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRoutes from './Routes';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './components/login/AuthContext'; // Import AuthProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your application with AuthProvider */}
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
