import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isOtpVerified: false,
    username: '',
    jwtToken: '',
    refreshToken: '',
    userId: null,
    phoneNumber: '',
    companyName: '',
    fullName: '',
    email: '',
    roleId: null,
  });

  useEffect(() => {
    const token = Cookies.get('jwtToken');
    const refreshToken = Cookies.get('refreshToken');
    const username = Cookies.get('username');
    const isOtpVerified = Cookies.get('isOtpVerified') === 'true';
    const userId = Cookies.get('userId');
    const phoneNumber = Cookies.get('phoneNumber');
    const companyName = Cookies.get('companyName');
    const fullName = Cookies.get('fullName');
    const email = Cookies.get('email');
    const roleId = Cookies.get('roleId');

    if (token && refreshToken && username && isOtpVerified) {
      setAuthState({
        isAuthenticated: true,
        isOtpVerified: true,
        username,
        jwtToken: token,
        refreshToken,
        userId,
        phoneNumber,
        companyName,
        fullName,
        email,
        roleId,
      });
    }
  }, []); // Empty dependency array to run this effect only once on mount

  const login = (username, userInfo) => {
    Cookies.set('username', username, { expires: 7 });
    Cookies.set('userId', userInfo.UserId, { expires: 7 });
    Cookies.set('phoneNumber', userInfo.PhoneNumber, { expires: 7 });
    Cookies.set('companyName', userInfo.CompanyName, { expires: 7 });
    Cookies.set('fullName', userInfo.FullName, { expires: 7 });
    Cookies.set('email', userInfo.Email, { expires: 7 });
    Cookies.set('roleId', userInfo.RoleId, { expires: 7 });
    setAuthState({
      isAuthenticated: true,
      isOtpVerified: false,
      username,
      userId: userInfo.UserId,
      phoneNumber: userInfo.PhoneNumber,
      companyName: userInfo.CompanyName,
      fullName: userInfo.FullName,
      email: userInfo.Email,
      roleId: userInfo.RoleId,
    });
  };

  const verifyOtp = (otpResponse) => {
    Cookies.set('isOtpVerified', 'true', { expires: 7 });
    Cookies.set('jwtToken', otpResponse.JwtToken, { expires: 7 });
    Cookies.set('refreshToken', otpResponse.RefreshToken, { expires: 7 });
    setAuthState((prevState) => ({
      ...prevState,
      isOtpVerified: true,
      jwtToken: otpResponse.JwtToken,
      refreshToken: otpResponse.RefreshToken,
    }));
  };

  const logout = () => {
    Cookies.remove('jwtToken');
    Cookies.remove('refreshToken');
    Cookies.remove('username');
    Cookies.remove('isOtpVerified');
    Cookies.remove('userId');
    Cookies.remove('phoneNumber');
    Cookies.remove('companyName');
    Cookies.remove('fullName');
    Cookies.remove('email');
    Cookies.remove('roleId');
    setAuthState({
      isAuthenticated: false,
      isOtpVerified: false,
      username: '',
      jwtToken: '',
      refreshToken: '',
      userId: null,
      phoneNumber: '',
      companyName: '',
      fullName: '',
      email: '',
      roleId: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
