import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UserModal.css';

const UserModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    CompanyName: '',
    UserName: '',
    FullName: '',
    Email: '',
    Password: '',
    RoleId: 1
  });

  useEffect(() => {
    if (user) {
      setFormData({
        CompanyName: user.CompanyName,
        UserName: user.UserName,
        FullName: user.FullName,
        Email: user.Email,
        Password: user.Password,
        RoleId: user.RoleId
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        // Edit user
        await axios.put(`https://c844-5-191-107-49.ngrok-free.app/api/AdminApplicationUser/${user.Id}`, formData);
      } else {
        // Create new user
        await axios.post(`https://c844-5-191-107-49.ngrok-free.app/api/AdminApplicationUser/CreateUser`, formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  return (
    <div className="user-modal">
      <div className="modal-content">
        <h2>{user ? 'Edit User' : 'Create New User'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Company Name:
            <input type="text" name="CompanyName" value={formData.CompanyName} onChange={handleChange} required />
          </label>
          <label>
            User Name:
            <input type="text" name="UserName" value={formData.UserName} onChange={handleChange} required />
          </label>
          <label>
            Full Name:
            <input type="text" name="FullName" value={formData.FullName} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="Email" value={formData.Email} onChange={handleChange} />
          </label>
          <label>
            Password:
            <input type="password" name="Password" value={formData.Password} onChange={handleChange} required />
          </label>
          <label>
            Role ID:
            <input type="number" name="RoleId" value={formData.RoleId} onChange={handleChange} required />
          </label>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
