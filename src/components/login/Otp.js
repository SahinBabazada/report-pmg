import React, { useState, useContext, useEffect } from 'react';
import './css/Otp.css';
import { useNavigate } from 'react-router-dom';
import config from '../../configs/config.json';
import { AuthContext } from './AuthContext';

function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { authState, verifyOtp } = useContext(AuthContext);

  useEffect(() => {
    if (authState.isAuthenticated && authState.isOtpVerified) {
      navigate('/dashboard');
    }
  }, [authState, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const enteredOtp = otp.join('');
    navigate('/dashboard');
    // try {
    //   const response = await fetch(`${config.apiHost}/api/ApplicationUser/OtpConfirmationForLogin`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ otpToken: enteredOtp }),
    //   });

    //   const data = await response.json();

    //   if (response.ok && data.isSuccess) {
    //     verifyOtp();
    //     navigate('/dashboard');
    //   } else {
    //     setError(data.message || 'OTP confirmation failed');
    //   }
    // } catch (error) {
    //   setError('An error occurred. Please try again later.');
    // }
  };

  return (
    <div className="otp-page">
      <div className="form">
        <form className="otp-form" onSubmit={handleSubmit}>
          <h2>Enter OTP</h2>
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                required
              />
            ))}
          </div>
          <button type="submit">Submit</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Otp;
