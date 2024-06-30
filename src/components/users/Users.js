import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './css/Users.css';
import config from '../../configs/config.json';
import { AuthContext } from '../login/AuthContext';

const UsersTable = ({ onEditUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { authState } = useContext(AuthContext);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.apiHost}/api/AdminApplicationUser`, {
        params: {
          Page: pageIndex + 1,
          'ShowMore.Take': pageSize,
        },
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
          'Authorization': `Bearer ${authState.jwtToken}`,
        }
      });
      setUsers(response.data[0].AppUsers);
      setTotalPages(Math.ceil(response.data[0].TotalAppUserCount / pageSize));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageIndex, pageSize]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${config.apiHost}/api/AdminApplicationUser/${userId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
          'Authorization': `Bearer ${authState.jwtToken}`,
        }
      });
      fetchUsers(); // Refresh the users list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user) => {
    onEditUser(user);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <table className="user-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>User Name</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role ID</th>
                <th>Is Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.Id}>
                  <td>{user.CompanyName}</td>
                  <td>{user.UserName}</td>
                  <td>{user.FullName}</td>
                  <td>{user.Email}</td>
                  <td>{user.RoleId}</td>
                  <td>{user.IsActive ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="user-btn-edit" onClick={() => handleEditUser(user)}>Edit</button>
                    <button className="user-btn-delete" onClick={() => handleDeleteUser(user.Id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>{'<<'}</button>
            <button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0}>{'<'}</button>
            <span>Page {pageIndex + 1} of {totalPages}</span>
            <button onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex >= totalPages - 1}>{'>'}</button>
            <button onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1}>{'>>'}</button>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>Show {size}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const { authState } = useContext(AuthContext);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditUser(null);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      Id: editUser ? editUser.Id : 0,
      CompanyName: formData.get('CompanyName'),
      FullName: formData.get('FullName'),
      UserName: formData.get('UserName'),
      Email: formData.get('Email'),
      PhoneNumber: formData.get('PhoneNumber'),
      Password: formData.get('Password'),
      RoleIds: [Number(formData.get('RoleId'))]
    };

    try {
      if (editUser) {
        await axios.put(
          `${config.apiHost}/api/AdminApplicationUser`,
          data,
          {
            headers: {
              'ngrok-skip-browser-warning': 'any-value',
              'Authorization': `Bearer ${authState.jwtToken}`,
            }
          }
        );
      } else {
        await axios.post(
          `${config.apiHost}/api/AdminApplicationUser/CreateUser`,
          data,
          {
            headers: {
              'ngrok-skip-browser-warning': 'any-value',
              'Authorization': `Bearer ${authState.jwtToken}`,
            }
          }
        );
      }
      handleCloseModal();
      // Add logic to refresh the users list
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="users-container">
      <button className="user-btn-create" onClick={handleOpenModal}>Create New User</button>
      <UsersTable onEditUser={handleEditUser} />
      {isModalOpen && (
        <div className="user-modal">
          <div className="user-modal-content">
            <span className="user-close" onClick={handleCloseModal}>&times;</span>
            <h2>{editUser ? 'Edit User' : 'Create New User'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="CompanyName"
                defaultValue={editUser ? editUser.CompanyName : ''}
                placeholder="Company Name"
                required
              />
              <input
                type="text"
                name="FullName"
                defaultValue={editUser ? editUser.FullName : ''}
                placeholder="Full Name"
                required
              />
              <input
                type="text"
                name="UserName"
                defaultValue={editUser ? editUser.UserName : ''}
                placeholder="User Name"
                required
              />
              <input
                type="email"
                name="Email"
                defaultValue={editUser ? editUser.Email : ''}
                placeholder="Email"
              />
              <input
                type="text"
                name="PhoneNumber"
                defaultValue={editUser ? editUser.PhoneNumber : ''}
                placeholder="Phone Number"
              />
              <input
                type="password"
                name="Password"
                defaultValue={editUser ? editUser.Password : ''}
                placeholder="Password"
                required
              />
              <input
                type="number"
                name="RoleId"
                defaultValue={editUser ? editUser.RoleId : ''}
                placeholder="Role ID"
                required
              />
              <button className="user-btn-save" type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
