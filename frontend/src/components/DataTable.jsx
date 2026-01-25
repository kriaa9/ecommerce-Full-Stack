/**
 * DataTable - Reusable table component for admin pages
 * @param {Array} columns - Array of column objects { key, label, render }
 * @param {Array} data - Array of data objects
 * @param {boolean} loading - Loading state
 * @param {string} emptyMessage - Message to show when no data
 */
const DataTable = ({ columns, data, loading, emptyMessage = "No data available" }) => {
  if (loading) return <div className="admin-loading">Loading data...</div>;

  if (!data || data.length === 0) {
    return (
      <div className="admin-empty">
        <h3>{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={row.id || rowIndex}>
            {columns.map((column) => (
              <td key={`${row.id || rowIndex}-${column.key}`}>
                {column.render ? column.render(row) : (row[column.key] || '-')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
