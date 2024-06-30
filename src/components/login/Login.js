import React, { useState, useContext } from 'react';
import './css/Login.css';
import { useNavigate } from 'react-router-dom';
import config from '../../configs/config.json';
import { AuthContext } from './AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.apiHost}/api/AdminApplicationUser/Login`, {
        Email: email,
        Password: password,
      });

      if (response.data.IsSuccess) {
        const userInfo = response.data;
        login(email, userInfo);
        navigate('/otp');
      } else {
        setError(response.data.Message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
