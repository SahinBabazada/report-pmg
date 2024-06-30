import React, { useState, useEffect, useContext } from 'react';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import DateRangePickerComponent from '../dateRangePicker/DateRangePickerComponent';
import ImportExcel from '../importExcelModal/importExcelModal';
import BulkDeleteModal from '../bulkDelete/BulkDeleteModal';
import TableComponent from '../table/TableComponent';
import Users from '../users/Users';
import { SidebarContext, SidebarProvider } from '../sidebar/SidebarContext';
import './Dashboard.css';

const Dashboard = () => {
  const { selectedMenuItem, setSelectedMenuItem } = useContext(SidebarContext);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    const columns = getTableProps()?.columns || [];
    setSelectedColumns(columns.map(column => column.accessor));
  }, [selectedMenuItem]);

  const handleUploadSuccess = () => {};

  const handleDeleteSuccess = () => {};

  const getTableProps = () => {
    switch (selectedMenuItem) {
      case 'salary-table':
        return {
          endpoint: '/api/Salary',
          columns: [
            { Header: 'Company Name', accessor: 'CompanyName' },
            { Header: 'Period', accessor: 'Period', Cell: ({ value }) => new Date(value).toLocaleDateString() },
            { Header: 'Badge', accessor: 'Badge' },
            { Header: 'Full Name', accessor: 'FullName' },
            { Header: 'Gender', accessor: 'Gender' },
            { Header: 'Birth Date', accessor: 'BirthDate', Cell: ({ value }) => new Date(value).toLocaleDateString() },
            { Header: 'Position', accessor: 'Position' },
            { Header: 'Position Group', accessor: 'PositionGroup' },
            { Header: 'Division', accessor: 'Division' },
            { Header: 'Department', accessor: 'Department' },
            { Header: 'Functional Area', accessor: 'FunctionalArea' },
            { Header: 'Start Date', accessor: 'StartDate', Cell: ({ value }) => new Date(value).toLocaleDateString() },
            { Header: 'End Date', accessor: 'EndDate', Cell: ({ value }) => (value === '0001-01-01T00:00:00' ? 'N/A' : new Date(value).toLocaleDateString()) },
            { Header: 'Resignation Types', accessor: 'ResignationTypes' },
            { Header: 'Contract Types', accessor: 'ContractTypes' },
            { Header: 'Collar', accessor: 'Collar' },
            { Header: 'Nationality', accessor: 'Nationality' },
            { Header: 'Managerial Status', accessor: 'ManagerialStatus' },
            { Header: 'CEO', accessor: 'CxO' }
          ]
        };
      case 'recruitment':
        return {
          endpoint: '/api/Recruitment',
          columns: [
            { Header: 'Candidate Name', accessor: 'CandidateName' },
            { Header: 'Position', accessor: 'Position' },
            { Header: 'Application Date', accessor: 'ApplicationDate', Cell: ({ value }) => new Date(value).toLocaleDateString() },
            { Header: 'Status', accessor: 'Status' },
            { Header: 'Interviewer', accessor: 'Interviewer' }
          ]
        };
      case 'hr-performance-ratio':
        return {
          endpoint: '/api/HRPerformanceRatio',
          columns: [
            { Header: 'Company Name', accessor: 'CompanyName' },
            { Header: 'Period', accessor: 'Period', Cell: ({ value }) => new Date(value).toLocaleDateString() },
            { Header: 'Total Revenue', accessor: 'TotalRevenue' },
            { Header: 'Total Profit', accessor: 'TotalProfit' },
            { Header: 'Total Labor Cost', accessor: 'TotalLaborCost' },
            { Header: 'Total OPEX', accessor: 'TotalOPEX' },
            { Header: 'Total Absence Days', accessor: 'TotalAbsenceDays' },
            { Header: 'Total Overtime Amount', accessor: 'TotalOvertimeAmount' },
            { Header: 'Total Pay', accessor: 'TotalPay' },
            { Header: 'Total HR Employees', accessor: 'TotalHREmployees' },
            { Header: 'Total HR Cost', accessor: 'TotalHRCost' },
            { Header: 'Total Promoted Employees', accessor: 'TotalPromotedEmployees' },
            { Header: 'Total Cost of Benefit', accessor: 'TotalCostOfBenefit' }
          ]
        };
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'salary-table':
      case 'recruitment':
      case 'hr-performance-ratio':
        const tableProps = getTableProps();
        return tableProps ? <TableComponent dateRange={dateRange} {...tableProps} selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} /> : <div>Select a menu item to view content</div>;
      case 'users':
        return <Users />;
      default:
        return <div>Select a menu item to view content</div>;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <Header />
      </div>
      <div className="dashboard-main">
        <div className="dashboard-sidebar">
          <Sidebar onSelectMenuItem={setSelectedMenuItem} />
        </div>
        <div className="dashboard-content">
          {selectedMenuItem !== 'users' && (
            <div className="dashboard-top-bar">
              <DateRangePickerComponent onChange={setDateRange} />
              <div className="dashboard-button-group">
                <ImportExcel onUploadSuccess={handleUploadSuccess} />
                <BulkDeleteModal onDeleteSuccess={handleDeleteSuccess} />
              </div>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const DashboardWithProvider = () => (
  <SidebarProvider>
    <Dashboard />
  </SidebarProvider>
);

export default DashboardWithProvider;
