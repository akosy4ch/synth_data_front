import React from "react";

function SyntheticPreview({ data }) {
  return (
    <div>
      <h3>🧪 Synthetic Data Preview</h3>
      {data.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, i) => (
              <tr key={i}>
                {Object.keys(row).map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SyntheticPreview;
