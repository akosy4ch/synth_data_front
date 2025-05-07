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
    <div style={{ marginTop: "2rem" }}>
      <h3>Select Columns to Generate</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {columns.map((col) => (
          <li key={col.name}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(col.name)}
                onChange={() => toggleColumn(col.name)}
              />
              <strong> {col.name} </strong> — {col.dtype}, {col.unique_values} unique
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColumnSelector;
