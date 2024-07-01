// src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';
import pmgLogo from '../../assets/logo.jfif'

const Sidebar = ({ onSelectMenuItem }) => {
  const [activeItem, setActiveItem] = useState('salary-table');

  const handleMenuItemClick = (item) => {
    setActiveItem(item);
    onSelectMenuItem(item);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={pmgLogo} alt="Company Logo" className="company-logo" />
        <span>PASHA Management Company</span>
      </div>
      <div className="sidebar-menu">
        <div
          className={`menu-item ${activeItem === 'salary-table' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('salary-table')}
        >
          Salary Table
        </div>
        <div
          className={`menu-item ${activeItem === 'recruitment' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('recruitment')}
        >
          Recruitment
        </div>
        <div
          className={`menu-item ${activeItem === 'vacation' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('vacation')}
        >
          Vacation
        </div>
        <div
          className={`menu-item ${activeItem === 'ld' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('ld')}
        >
          LD
        </div>
        <div
          className={`menu-item ${activeItem === 'disciplinary' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('disciplinary')}
        >
          Disciplinary
        </div>
        <div
          className={`menu-item ${activeItem === 'hr-performance-ratio' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('hr-performance-ratio')}
        >
          HR Performance Ratio
        </div>
        <div
          className={`menu-item ${activeItem === 'hipo' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('hipo')}
        >
          HiPO
        </div>
        <div
          className={`menu-item ${activeItem === 'users' ? 'active' : ''}`}
          onClick={() => handleMenuItemClick('users')}
        >
          Users
        </div>
      </div>
      <div className="sidebar-footer">
        <span>&copy; 2007-2024</span>
      </div>
    </div>
  );
};

export default Sidebar;
