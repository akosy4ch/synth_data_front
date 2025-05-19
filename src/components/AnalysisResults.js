import React from "react";

function AnalysisResults({ rows, columns }) {
  return (
    <div className="card mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">📊 Dataset Info</h3>
      <p className="mb-2 text-gray-700">Total rows: <span className="font-semibold">{rows}</span></p>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
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
