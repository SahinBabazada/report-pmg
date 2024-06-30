import React, { useState, useContext } from 'react';
import { AuthContext } from '../login/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

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

  const handleUserInformation = () => {
    navigate('/user-information');
    setDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Add any additional content or components here */}
      </div>
      <div className="header-right">
        <div className="user-info" onClick={toggleDropdown}>
          <span className="company-name">{authState.companyName}</span>
          <span className="user-initials">{authState.fullName.split(" ").map((animal) => animal[0]).join('')}</span>
          <span className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}>▾</span>
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">Seçimlər</div>
            <div className="dropdown-item" onClick={handleUserInformation}>
              <span>Şəxsi məlumatlar</span>
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
