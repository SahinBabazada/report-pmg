import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './components/login/AuthContext';

import Dashboard from './components/main/Dashboard';
import Login from './components/login/Login';
import Otp from './components/login/Otp';
import UserInformation from './components/userInformation/UserInformation';

const PrivateRoute = ({ element }) => {
  const { authState } = useContext(AuthContext);
  return authState.isAuthenticated && authState.isOtpVerified ? element : <Navigate to="/" />;
};

const AppRoutes = () => {
  const { authState } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={authState.isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/user-information" element={<UserInformation />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
