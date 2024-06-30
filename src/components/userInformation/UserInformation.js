import React, { useContext, useState } from 'react';
import './UserInformation.css';
import { AuthContext } from '../login/AuthContext';
import Modal from 'react-modal';

const UserInformation = () => {
  const { authState } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({ ...authState });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save the changes (send to server or update context state)
    setIsEditing(false);
  };

  return (
    <div className="user-info-container">
      <h2>User Information</h2>
      <div className="user-info-details">
        <div className="user-info-detail">
          <label>Full Name:</label>
          <span>{authState.fullName}</span>
        </div>
        <div className="user-info-detail">
          <label>Email:</label>
          <span>{authState.email}</span>
        </div>
        <div className="user-info-detail">
          <label>Phone Number:</label>
          <span>{authState.phoneNumber}</span>
        </div>
        <div className="user-info-detail">
          <label>Company Name:</label>
          <span>{authState.companyName}</span>
        </div>
        <div className="user-info-detail">
          <label>Role:</label>
          <span>{authState.roleId}</span>
        </div>
        <button className="btn btn-edit" onClick={handleEdit}>Edit</button>
      </div>

      {isEditing && (
        <Modal
          isOpen={isEditing}
          onRequestClose={() => setIsEditing(false)}
          className="user-info-modal"
          overlayClassName="user-info-modal-overlay"
        >
          <h2>Edit User Information</h2>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={userInfo.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={userInfo.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input
                type="number"
                name="roleId"
                value={userInfo.roleId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-buttons">
              <button className="btn btn-save" type="submit">Save</button>
              <button className="btn btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserInformation;
