import React, { useState, useContext } from 'react';
import axios from 'axios';
import config from '../../configs/config.json';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/importExcelModal.css';
import { SidebarContext } from '../sidebar/SidebarContext';

const ImportExcel = ({ onUploadSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { selectedMenuItem } = useContext(SidebarContext);

  const apiEndpoints = {
    'salary-table': `${config.apiHost}/api/Salary/importexceldata`,
    'recruitment': `${config.apiHost}/api/Recruitment/importexceldata`,
    'vacation': `${config.apiHost}/api/Vacation/importexceldata`,
    'ld': `${config.apiHost}/api/LearningAndDevelopment/importexceldata`,
    'disciplinary': `${config.apiHost}/api/Disciplinary/importexceldata`,
    'hr-performance-ratio': `${config.apiHost}/api/HRPerformanceRatio/importexceldata`,
    'hipo': `${config.apiHost}/api/HiPo/importexceldata`
  };

  const templateFiles = {
    'salary-table': '/templates/SalaryTemplate.xlsx',
    'recruitment': '/templates/RecruitmentTemplate.xlsx',
    'vacation': '/templates/VacationTemplate.xlsx',
    'ld': '/templates/LearningAndDevelopmentTemplate.xlsx',
    'disciplinary': '/templates/DisciplinaryTemplate.xlsx',
    'hr-performance-ratio': '/templates/HRPerformanceRatioTemplate.xlsx',
    'hipo': '/templates/HiPoTemplate.xlsx'
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warn('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(apiEndpoints[selectedMenuItem], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'any-value'
        }
      });
      toast.success('File uploaded successfully');
      setFile(null);
      onUploadSuccess(); // Notify parent component to refresh data
      toggleModal(); // Close modal
    } catch (error) {
      console.error('Error uploading file', error);
      toast.error('Error uploading file');
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
            <div className="modal-body">
              <a href={templateFiles[selectedMenuItem]} download className="template-download-link">Download Excel Template</a>
             
              <form onSubmit={handleUpload}>
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
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ImportExcel;
