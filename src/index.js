import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './Routes';
import { AuthProvider } from './components/login/AuthContext';
import Modal from 'react-modal';
import './index.css';

Modal.setAppElement('#root'); 

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
