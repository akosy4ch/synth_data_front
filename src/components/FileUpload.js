import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onColumnsDetected, onFileSelected }) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(""); // new state for error handling

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError(""); // reset error when a new file is selected
    onFileSelected(file); // для дальнейшего использования в генерации

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyze-columns/`,formData);
      onColumnsDetected(response.data.columns); // прокидываем в родительский компонент
    } catch (error) {
      setError(error.message); // set error message on failure
      console.error("Error analyzing file:", error);
    }
  };

  return (
    <div>
      <h3>Upload Dataset</h3>
      <input type="file" onChange={handleFileChange} accept=".csv,.txt,.json,.xlsx,.xls" />
      {fileName && <p>Selected: {fileName}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>} {/* display error message */}
    </div>
  );
};

export default FileUpload;
