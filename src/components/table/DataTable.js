import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import 'tailwindcss/tailwind.css';

const DataTable = ({ columns, data }) => {
  useEffect(() => {
    const table = $('#example').DataTable({
      responsive: true,
      data: data,
      columns: columns,
      destroy: true // Ensure the table is recreated on data change
    });

    return () => {
      table.destroy();
    };
  }, [data, columns]);

  return (
    <div className="container w-full md:w-4/5 xl:w-3/5 mx-auto px-2">
      <h1 className="flex items-center font-sans font-bold break-normal text-indigo-500 px-2 py-8 text-xl md:text-2xl">
        Responsive <a className="underline mx-2" href="https://datatables.net/">DataTables.net</a> Table
      </h1>
      <div id="recipients" className="p-8 mt-6 lg:mt-0 rounded shadow bg-white">
        <table id="example" className="stripe hover" style={{ width: '100%', paddingTop: '1em', paddingBottom: '1em' }}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} data-priority={index + 1}>{col.title}</th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
