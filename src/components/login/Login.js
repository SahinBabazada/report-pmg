import React, { useState, useContext, useEffect } from 'react';
import './css/Login.css';
import { useNavigate } from 'react-router-dom';
import config from '../../configs/config.json';
import { AuthContext } from './AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { authState, login } = useContext(AuthContext);

  useEffect(() => {
    if (authState.isAuthenticated && authState.isOtpVerified) {
      navigate('/dashboard');
    } else if (authState.isAuthenticated) {
      navigate('/otp');
    }
  }, [authState, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    navigate('/otp');
    // try {
    //   const response = await fetch(`${config.apiHost}/api/AdminApplicationUser/Login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ userName: username, password: password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     login(username, data.jwtToken);
    //     navigate('/otp');
    //   } else {
    //     setError(data.message || 'Login failed');
    //   }
    // } catch (error) {
    //   setError('An error occurred. Please try again later.');
    // }
  };
  

  return (
    <div className="login-page">
      <div className="form">
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
