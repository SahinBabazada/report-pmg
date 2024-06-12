import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import { useTable, usePagination, useFlexLayout } from 'react-table';
import './TableComponent.css';
import config from '../../configs/config.json';

const CustomPagination = ({ pageCount, pageIndex, gotoPage, previousPage, nextPage, canPreviousPage, canNextPage }) => {
  const generatePageNumbers = () => {
    const totalNumbers = 5; // Number of pages to show
    const totalBlocks = totalNumbers + 2;

    if (pageCount > totalBlocks) {
      const startPage = Math.max(2, pageIndex - 1);
      const endPage = Math.min(pageCount - 1, pageIndex + 3);

      let pages = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = (pageCount - endPage) > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = Array.from({ length: spillOffset }, (_, i) => startPage - spillOffset + i);
          pages = ['LEFT', ...extraPages, ...pages];
          break;
        }
        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = Array.from({ length: spillOffset }, (_, i) => endPage + i + 1);
          pages = [...pages, ...extraPages, 'RIGHT'];
          break;
        }
        case (hasLeftSpill && hasRightSpill):
        default: {
          pages = ['LEFT', ...pages, 'RIGHT'];
          break;
        }
      }

      return [1, ...pages, pageCount];
    }

    return Array.from({ length: pageCount }, (_, i) => i + 1);
  };

  const pages = generatePageNumbers();

  return (
    <div className="pagination">
      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        {'<<'}
      </button>
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>
        {'<'}
      </button>
      {pages.map((page, index) =>
        page === 'LEFT' || page === 'RIGHT' ? (
          <span key={index} className="pagination-ellipsis">
            &hellip;
          </span>
        ) : (
          <button
            key={index}
            onClick={() => gotoPage(page - 1)}
            className={`pagination-number ${pageIndex === page - 1 ? 'active' : ''}`}
          >
            {page}
          </button>
        )
      )}
      <button onClick={() => nextPage()} disabled={!canNextPage}>
        {'>'}
      </button>
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        {'>>'}
      </button>
    </div>
  );
};

const TableComponent = ({ endpoint, columns, dateRange, pageIndex, setPageIndex, selectedColumns, setColumns }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchData = useCallback(async ({ pageIndex, pageSize }) => {
    setLoading(true);
    try {
      const params = {
        Page: pageIndex + 1, // API expects one-based index
        'ShowMore.Take': pageSize,
        CompanyName: "Bravo",
        StartPeriod: dateRange.startDate.toISOString().split('T')[0],
        EndPeriod: dateRange.endDate.toISOString().split('T')[0],
      };

      const url = new URL(endpoint, config.apiHost);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      const response = await axios.get(url.toString(), {
        headers: {
          'ngrok-skip-browser-warning': 'any-value'
        }
      });

      const data = response.data;

      let fetchedData = [];
      let totalItemCount = 0;

      if (endpoint.includes('/HRPerformanceRatio')) {
        fetchedData = data[0]?.HRPerformanceRatios || [];
        totalItemCount = data[0]?.TotalHRPerformanceRatioCount || 0;
      } else if (endpoint.includes('/Salary')) {
        fetchedData = data[0]?.Salaries || [];
        totalItemCount = data[0]?.TotalSalaryCount || 0;
      } else if (endpoint.includes('/Recruitment')) {
        fetchedData = data[0]?.Recruitment || [];
        totalItemCount = data[0]?.TotalRecruitmentCount || 0;
      }

      setData(fetchedData);
      setTotalPages(Math.ceil(totalItemCount / pageSize));
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, dateRange]);

  const handleColumnToggle = accessor => {
    setColumns(prev =>
      prev.includes(accessor) ? prev.filter(col => col !== accessor) : [...prev, accessor]
    );
  };

  const handleSelectAll = () => {
    if (selectedColumns.length === columns.length) {
      setColumns([]);
    } else {
      setColumns(columns.map(column => column.accessor));
    }
  };

  const filteredColumns = useMemo(() => {
    return columns.filter(column => selectedColumns.includes(column.accessor));
  }, [columns, selectedColumns]);

  const headersRef = useRef([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state,
    setPageSize
  } = useTable(
    {
      columns: filteredColumns,
      data: data || [], // Ensure data is always an array
      manualPagination: true,
      pageCount: totalPages,
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useFlexLayout,
    usePagination
  );

  useEffect(() => {
    fetchData({ pageIndex: state.pageIndex, pageSize: state.pageSize });
  }, [state.pageIndex, state.pageSize, dateRange, fetchData]);

  useEffect(() => {
    setPageIndex(0);
    setColumns(columns.map(column => column.accessor));
  }, [columns, setPageIndex, setColumns]);

  return (
    <div className="table-component">
      <div className="column-selector">
        <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
          Columns
        </button>
        {dropdownOpen && (
          <div className="dropdown-content">
            <label>
              <input
                type="checkbox"
                checked={selectedColumns.length === columns.length}
                onChange={handleSelectAll}
              />
              Select All
            </label>
            {columns.map(column => (
              <label key={column.accessor}>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column.accessor)}
                  onChange={() => handleColumnToggle(column.accessor)}
                />
                {column.Header}
              </label>
            ))}
          </div>
        )}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : data.length > 0 ? (
        <>
          <div className="table-wrapper">
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup, i) => (
                  <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => {
                      const { key, ...rest } = column.getHeaderProps();
                      return (
                        <th key={key || index} {...rest} ref={el => (headersRef.current[index] = el)}>
                          {column.render('Header')}
                          <div className="resizer" />
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr key={i} {...row.getRowProps()}>
                      {row.cells.map((cell, index) => (
                        <td key={index} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <CustomPagination
            pageCount={totalPages}
            pageIndex={state.pageIndex}
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
          />
          <div className="page-size-selector">
            <span>
              Page{' '}
              <strong>
                {state.pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <select
              value={state.pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
};

export default TableComponent;
