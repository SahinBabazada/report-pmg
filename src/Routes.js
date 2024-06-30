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

const AuthenticatedRoute = ({ element }) => {
  const { authState } = useContext(AuthContext);
  if (authState.isAuthenticated && authState.isOtpVerified) {
    return <Navigate to="/dashboard" />;
  } else if (authState.isAuthenticated && !authState.isOtpVerified) {
    return <Navigate to="/otp" />;
  }
  return element;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticatedRoute element={<Login />} />} />
        <Route path="/otp" element={<AuthenticatedRoute element={<Otp />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/user-information" element={<PrivateRoute element={<UserInformation />} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
