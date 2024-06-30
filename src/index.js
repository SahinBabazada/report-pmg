import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './Routes';
import { AuthProvider } from './components/login/AuthContext';
import Modal from 'react-modal';
import './index.css';

Modal.setAppElement('#root'); 

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
 