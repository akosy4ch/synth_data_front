// components/AnalyzeColumns.js
import React, { useState } from "react";
import axios from "axios";

const AnalyzeColumns = ({ setColumns, setFile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFile(file); // pass file to parent
  };

  const analyze = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyze-columns/`, formData);
      setAnalysisResult(response.data);
      setColumns(response.data.columns); // <-- set full column objects
    } catch (error) {
      console.error("Column analysis failed", error);
    }
  };


  return (
    <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #eee", borderRadius: "8px", background: "#fafbfc" }}>
      <label style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}>
        Upload Dataset
      </label>
      <input type="file" onChange={handleFileChange} style={{ marginBottom: "0.5rem" }} />
      <button
        onClick={analyze}
        style={{
          marginLeft: "1rem",
          padding: "6px 18px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Analyze Columns
      </button>
      {analysisResult && analysisResult.columns && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>📊 Columns Detected</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Unique</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Sample</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Avg Length</th>
              </tr>
            </thead>
            <tbody>
              {analysisResult.columns.map(col => (
                <tr key={col.name}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{col.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{col.dtype}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{col.unique_values}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {col.sample && col.sample.length > 0 ? col.sample[0] : "-"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {col.avg_length !== null ? col.avg_length.toFixed(1) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "0.5rem", color: "#555" }}>
            Total rows: <b>{analysisResult.rows}</b>
          </div>
        </div>
      )}
    </div>
  );

};

export default AnalyzeColumns;
