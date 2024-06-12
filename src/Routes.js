// src/Routes.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Otp from './components/login/Otp';
import Dashboard from './components/main/Dashboard';

import { AuthContext } from './components/login/AuthContext';

const PrivateRoute = ({ element }) => {
  const { authState } = useContext(AuthContext);
  return authState.isAuthenticated && authState.isOtpVerified ? element : <Navigate to="/" />;
};

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default AppRoutes;
