import React, { useState } from 'react';
import axios from 'axios';
import './BulkDeleteModal.css'; // Updated CSS file
import config from '../../configs/config.json';

const BulkDeleteModal = ({ onDeleteSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleting, setDeleting] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      const response = await axios.delete(`${config.apiHost}/api/Salary/DeleteByDateRange`, {
        params: {
          StartPeriod: startDate,
          EndPeriod: endDate
        },
        headers: {
          'accept': '*/*',
          'ngrok-skip-browser-warning': 'any-value'
        }
      });
      alert(`${response.data} salaries deleted successfully.`);
      setStartDate('');
      setEndDate('');
      onDeleteSuccess(); // Notify parent component to refresh data
      toggleModal(); // Close modal
    } catch (error) {
      console.error('Error deleting data', error);
      alert('Error deleting data');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <button onClick={toggleModal} className="bulk-delete-btn-danger">Bulk Delete</button>
      {isOpen && (
        <div className="bulk-delete-overlay" onClick={toggleModal}>
          <div className="bulk-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bulk-delete-modal-header">
              <h2 className="bulk-delete-modal-title">Delete Salaries by Date Range</h2>
              <button className="bulk-delete-btn-close" onClick={toggleModal}>&times;</button>
            </div>
            <form onSubmit={handleDelete} className="bulk-delete-modal-body">
              <div className="bulk-delete-form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="bulk-delete-styled-input"
                />
              </div>
              <div className="bulk-delete-form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="bulk-delete-styled-input"
                />
              </div>
              <div className="bulk-delete-modal-footer">
                <button type="button" className="bulk-delete-btn-secondary" onClick={toggleModal}>Cancel</button>
                <button type="submit" disabled={deleting} className="bulk-delete-btn-danger">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkDeleteModal;
