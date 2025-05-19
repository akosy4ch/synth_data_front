import React from "react";

const ColumnSelector = ({ columns, selected, setSelected }) => {
  const toggleColumn = (colName) => {
    if (selected.includes(colName)) {
      setSelected(selected.filter((c) => c !== colName));
    } else {
      setSelected([...selected, colName]);
    }
  };

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Select Columns to Generate</h3>
      <ul className="space-y-2">
        {columns.map((col) => (
          <li key={col.name}>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selected.includes(col.name)}
                onChange={() => toggleColumn(col.name)}
                className="mr-2"
              />
              <span>
                <strong>{col.name}</strong> — {col.dtype}, {col.unique_values} unique
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColumnSelector;
