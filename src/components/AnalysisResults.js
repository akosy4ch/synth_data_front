import React from "react";

function AnalysisResults({ rows, columns }) {
  return (
    <div>
      <h3>📊 Dataset Info</h3>
      <p>Total rows: {rows}</p>
      <ul>
        {columns.map((col) => (
          <li key={col.name}>
            <b>{col.name}</b> – {col.dtype}, unique: {col.unique_values}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnalysisResults;
