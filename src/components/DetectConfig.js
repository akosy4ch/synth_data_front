// components/DetectConfig.js
import React, { useState } from "react";
import axios from "axios";

const DetectConfig = ({ file, setModels, setColumns }) => {
  const [recommendations, setRecommendations] = useState([]);

  const detect = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/detect-best-config/`, formData);
      setRecommendations(response.data.recommendations);
      // setColumns(response.data.recommendations.map(r => r.column));
      if (response.data.columns) {
        setColumns(response.data.columns); // if backend returns columns
      }
      const modelMap = {};
      response.data.recommendations.forEach(r => {
        modelMap[r.column] = r.recommended_model;
      });
      setModels(modelMap);
    } catch (error) {
      console.error("Detection failed", error);
    }
  };


  return (
    <div style={{ margin: "1.5rem 0", padding: "1rem", border: "1px solid #eee", borderRadius: "8px", background: "#f7fafc" }}>
      <button
        onClick={detect}
        style={{
          padding: "8px 22px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          fontSize: "15px",
          cursor: "pointer",
          marginBottom: "1rem"
        }}
      >
        🚀 Detect Best Config
      </button>
      {recommendations.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "0.7rem" }}>🔎 Model Recommendations</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {recommendations.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "1rem",
                  minWidth: "220px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "0.3rem" }}>
                  {r.column}
                  <span style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.95em",
                    color: r.recommended_model === "CTGAN" ? "#388e3c" : "#1976d2"
                  }}>
                    {r.recommended_model}
                  </span>
                </div>
                <div style={{ color: "#555", fontSize: "0.97em" }}>
                  Task: <b>{r.task}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectConfig;
