import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/UsersTable.css';
import config from '../../configs/config.json';

const UsersTable = ({ onEditUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.apiHost}/api/AdminApplicationUser`,
        {
          params: {
            Page: pageIndex + 1,
            'ShowMore.Take': pageSize
          },headers: {
            'ngrok-skip-browser-warning': 'any-value'
          }
        }
      );

      const data = response.data[0];
      setUsers(data.AppUsers);
      setTotalUsers(data.TotalAppUserCount);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `${config.apiHost}/api/AdminApplicationUser/${userId}`,
        
        {
          headers: {
            'ngrok-skip-browser-warning': 'any-value'
          }
        }
      );
      fetchUsers(pageIndex, pageSize);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPageIndex(0); // Reset to the first page when page size changes
  };

  return (
    <div className="users-table-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="users-table">
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
              {users.map(user => (
                <tr key={user.Id}>
                  <td>{user.CompanyName}</td>
                  <td>{user.UserName}</td>
                  <td>{user.FullName}</td>
                  <td>{user.Email}</td>
                  <td>{user.RoleId}</td>
                  <td>{user.IsActive ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => onEditUser(user)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.Id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(0)}
              disabled={pageIndex === 0}
            >
              {'<<'}
            </button>
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              {'<'}
            </button>
            <span>
              Page {pageIndex + 1} of {Math.ceil(totalUsers / pageSize)}
            </span>
            <button
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex >= Math.ceil(totalUsers / pageSize) - 1}
            >
              {'>'}
            </button>
            <button
              onClick={() => handlePageChange(Math.ceil(totalUsers / pageSize) - 1)}
              disabled={pageIndex >= Math.ceil(totalUsers / pageSize) - 1}
            >
              {'>>'}
            </button>
            <select value={pageSize} onChange={handlePageSizeChange}>
              {[10, 20, 50].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersTable;
