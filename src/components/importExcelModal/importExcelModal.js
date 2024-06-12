// src/components/ModalComponent.js
import React, { useState } from 'react';
import axios from 'axios';
import config from '../../configs/config.json';
import './importExcelModal.css';

const ImportExcel = ({ onUploadSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${config.apiHost}/api/Salary/importexceldata`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'any-value'
        }
      });
      alert('File uploaded successfully');
      setFile(null);
      onUploadSuccess(); // Notify parent component to refresh data
      toggleModal(); // Close modal
    } catch (error) {
      console.error('Error uploading file', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button onClick={toggleModal} className="btn-primary">Upload File</button>
      {isOpen && (
        <div className="overlay" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Upload Excel File</h2>
              <button className="btn-close" onClick={toggleModal}>&times;</button>
            </div>
            <form onSubmit={handleUpload} className="modal-body">
              <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
                <span className="upload-area-icon">📁</span>
                <span className="upload-area-title">Drag & drop file here or click to browse</span>
                {file && <span className="upload-area-description">{file.name}</span>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={toggleModal}>Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExcel;
