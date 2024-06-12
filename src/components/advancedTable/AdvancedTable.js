import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useTable, useResizeColumns, useFlexLayout, useRowSelect, useSortBy, usePagination } from 'react-table';
import './AdvancedTable.css';
import config from '../../configs/config.json';

const AdvancedTable = ({ endpoint, columns, dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

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

      const response = await axios.get(`${config.apiHost}${endpoint}`, {
        params,
        headers: {
          'ngrok-skip-browser-warning': 'any-value'
        }
      });

      const data = response.data;

      if (data && data.length > 0 && data[0].Salaries) {
        setData(data[0].Salaries);
        setTotalPages(Math.ceil(data[0].TotalSalaryCount / pageSize));
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, dateRange]);

  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of rows, use page for pagination
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data || [],
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 5 },
      manualPagination: true,
      pageCount: totalPages,
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <input type="checkbox" {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [pageIndex, pageSize, dateRange, fetchData]);

  return (
    <div className="table-component">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                        />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className={row.isSelected ? 'selected' : ''}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>
            {pageOptions.map((page, i) => (
              <button key={i} onClick={() => gotoPage(page)} className={pageIndex === page ? 'active' : ''}>
                {page + 1}
              </button>
            ))}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>
            <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <select
              value={pageSize}
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
      )}
    </div>
  );
};

export default AdvancedTable;
