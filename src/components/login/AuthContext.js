import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isOtpVerified: false,
    username: '',
    jwtToken: '',
  });

  useEffect(() => {
    const token = Cookies.get('jwtToken');
    const username = Cookies.get('username');
    const isOtpVerified = Cookies.get('isOtpVerified') === 'true';
    if (token && username && isOtpVerified) {
      setAuthState({
        isAuthenticated: true,
        isOtpVerified: true,
        username,
        jwtToken: token,
      });
    }
  }, []);

  const login = (username, jwtToken) => {
    Cookies.set('jwtToken', jwtToken, { expires: 7 });
    Cookies.set('username', username, { expires: 7 });
    setAuthState({
      isAuthenticated: true,
      isOtpVerified: false,
      username,
      jwtToken,
    });
  };

  const verifyOtp = () => {
    Cookies.set('isOtpVerified', 'true', { expires: 7 });
    setAuthState((prevState) => ({
      ...prevState,
      isOtpVerified: true,
    }));
  };

  const logout = () => {
    Cookies.remove('jwtToken');
    Cookies.remove('username');
    Cookies.remove('isOtpVerified');
    setAuthState({
      isAuthenticated: false,
      isOtpVerified: false,
      username: '',
      jwtToken: '',
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
