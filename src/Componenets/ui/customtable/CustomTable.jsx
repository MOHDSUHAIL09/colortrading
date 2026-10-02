import React from 'react';


const CustomTable = ({
  columns,
  children,
  loading = false,
  emptyMessage = "No data found"
}) => {
  return (
    <div className="custom-table-wrapper">
      <div className="table-responsive custom-table-responsive">
        <table className="table custom-table mb-0">
          <thead className="custom-table-head">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="custom-th">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="custom-table-body">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="custom-td text-center py-5">
                  <div className="custom-table-loading">
                    <div className="custom-table-spinner" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="custom-table-loading-text">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : (
              children
            )}

            {!loading && !children && (
              <tr>
                <td colSpan={columns.length} className="custom-td text-center py-5 custom-empty-msg">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;