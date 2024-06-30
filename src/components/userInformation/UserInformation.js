import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AuthContext } from '../login/AuthContext';
import Header from '../header/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/UserInformation.css';
import config from '../../configs/config.json';

const UserInformation = () => {
  const { authState } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
    Id: authState.userId,
    CompanyName: authState.companyName,
    FullName: authState.fullName,
    UserName: authState.username,
    Email: authState.email,
    PhoneNumber: authState.phoneNumber,
    Password: '',
    RoleIds: [authState.roleId]
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
    setUser((prevUser) => ({ ...prevUser, Password: '' }));
    setConfirmPassword('');
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 9) {
      setUser((prevUser) => ({
        ...prevUser,
        PhoneNumber: value
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.Password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await axios.put(`${config.apiHost}/api/AdminApplicationUser`, {
        ...user,
        PhoneNumber: `+994${user.PhoneNumber}`,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      });
      if (response.status === 200) {
        toast.success('User updated successfully');
        handleCloseModal();
      }
    } catch (error) {
      toast.error(error.response?.data || 'Error updating user');
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="user-info-page">
      <Header />
      <div className="user-info-main">
        <div className="user-info-content">
          <div className="user-info-container">
            <h2>User Information</h2>
            <div className="user-info-details">
              <div className="user-info-detail">
                <label>Full Name:</label>
                <span>{user.FullName}</span>
              </div>
              <div className="user-info-detail">
                <label>Email:</label>
                <span>{user.Email}</span>
              </div>
              <div className="user-info-detail">
                <label>Phone Number:</label>
                <span>{`+994 ${user.PhoneNumber}`}</span>
              </div>
              <div className="user-info-detail">
                <label>Company Name:</label>
                <span>{user.CompanyName}</span>
              </div>
              <div className="user-info-detail">
                <label>Role:</label>
                <span>{user.RoleIds.join(', ')}</span>
              </div>
            </div>
            <button className="btn btn-edit" onClick={handleOpenModal}>
              Edit
            </button>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Edit User Information"
            className="user-info-modal"
            overlayClassName="user-info-modal-overlay"
          >
            <h2>Edit User Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="FullName"
                  value={user.FullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div className="phone-input-container">
                  <span className="phone-prefix">+994</span>
                  <input
                    type="text"
                    name="PhoneNumber"
                    value={user.PhoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength="9"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="Password"
                    value={user.Password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="ConfirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {error && <p className="error">{error}</p>}
              <div className="form-buttons">
                <button type="submit" className="btn btn-save">
                  Save
                </button>
                <button type="button" className="btn btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserInformation;
