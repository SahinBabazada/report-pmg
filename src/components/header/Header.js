import React, { useState, useContext } from 'react';
import { AuthContext } from '../login/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';
// import companyLogo from '../assets/logo.svg';

const Header = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* <div className="notification">
          <span className="icon">🔔</span>
          <span className="badge">9+</span>
        </div> */}
      </div>
      <div className="header-right">
        <div className="user-info" onClick={toggleDropdown}>
          <span className="company-name">AZERBAIJAN SUPERMARKET LLC</span>
          <span className="user-initials">{authState.username.slice(0, 2).toUpperCase()}</span>
          <span className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}>▾</span>
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">Seçimlər</div>
            {/* <div className="dropdown-item">
              <img src={companyLogo} alt="Company Logo" className="company-logo" />
              <span>AZERBAIJAN SUPERMARKET LLC</span>
              <span className="checkmark">✔️</span>
            </div> */}
            <div className="dropdown-item">
              <span>Şəxsi məlumatlar</span>
            </div>
            <div className="dropdown-item">
              <span>Ayarlar</span>
            </div>
            <div className="dropdown-item logout" onClick={handleLogout}>
              <span>Çıxış</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
