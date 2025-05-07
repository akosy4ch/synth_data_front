import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onColumnsDetected, onFileSelected }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    onFileSelected(file); // для дальнейшего использования в генерации

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://172.17.111.15:8000/analyze-columns/", formData);
      onColumnsDetected(response.data.columns); // прокидываем в родительский компонент
    } catch (error) {
      console.error("Error analyzing file:", error);
    }
  };

  return (
    <div>
      <h3>Upload Dataset</h3>
      <input type="file" onChange={handleFileChange} accept=".csv,.txt,.json,.xlsx,.xls" />
      {fileName && <p>Selected: {fileName}</p>}
    </div>
  );
};

export default FileUpload;
