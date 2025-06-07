import React, { useState } from "react";
import axios from "axios";

const DetectConfig = ({ file, setModels, setColumns }) => {
  const [recommendations, setRecommendations] = useState([]);

  const detect = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/detect-best-config/`,   formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
      setRecommendations(response.data.recommendations|| []);
      if (response.data.columns) {
        setColumns(response.data.columns);
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
    <div className="my-6 p-6 rounded-xl bg-white shadow-md border border-gray-100">
      <button
        onClick={detect}
        className="btn-gradient mb-4"
      >
        🚀 Detect Best Config
      </button>

      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            🔎 Model Recommendations
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.map((r, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-gradient-to-br from-[#f0fdf4] via-white to-[#e6f0ff] border border-gray-200 shadow-sm"
              >
                <div className="font-bold text-gray-900 mb-1 flex justify-between items-center">
                  {r.column}
                  <span
                    className={`text-sm font-medium ${
                      r.recommended_model === "CTGAN"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {r.recommended_model}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Task: <span className="font-medium">{r.task}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectConfig;
