import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onColumnsDetected, onFileSelected }) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError("");
    onFileSelected(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/analyze-columns/`,
        formData
      );
      onColumnsDetected(response.data.columns);
    } catch (error) {
      setError("Failed to analyze file. Please try again.");
      console.error("Error analyzing file:", error);
    }
  };

  return (
    <div className="card my-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">📁 Upload Dataset</h3>

      <label
        htmlFor="fileInput"
        className="cursor-pointer inline-block btn-gradient"
      >
        Choose File
      </label>

      <input
        id="fileInput"
        type="file"
        accept=".csv,.txt,.json,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <p className="mt-3 text-sm text-green-600 font-medium">
          ✅ Selected: <span className="font-medium">{fileName}</span>
        </p>
      )}

      {error && (
        <p className="alert-error mt-3">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
