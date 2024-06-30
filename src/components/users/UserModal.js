import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UserModal.css';
import config from '../../configs/config.json';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    CompanyName: '',
    UserName: '',
    FullName: '',
    Email: '',
    PhoneNumber: '',
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
        PhoneNumber: user.PhoneNumber,
        Password: '',
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

    // Check if all required fields are filled
    if (!formData.CompanyName || !formData.UserName || !formData.FullName || !formData.Email || !formData.PhoneNumber || !formData.Password || !formData.RoleId) {
      toast.warn('All fields are required');
      return;
    }

    try {
      const url = user
        ? `${config.apiHost}/api/AdminApplicationUser`
        : `${config.apiHost}/api/AdminApplicationUser/CreateUser`;
      const method = user ? 'put' : 'post';
      const payload = {
        ...formData,
        PhoneNumber: formData.PhoneNumber.replace(/\D/g, '') // remove non-numeric characters
      };

      const response = await axios({
        method,
        url,
        params: payload,
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'ngrok-skip-browser-warning': 'any-value'
        }
      });

      if (response.data.IsSuccess) {
        toast.success(`User ${user ? 'updated' : 'created'} successfully`);
        onClose();
      } else {
        toast.error(response.data.Message || 'Error occurred');
      }
    } catch (error) {
      toast.error('Failed to save user');
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
            Phone Number:
            <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required />
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
      <ToastContainer />
    </div>
  );
};

export default UserModal;
