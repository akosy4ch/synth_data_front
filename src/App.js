import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import ColumnSelector from "./components/ColumnSelector";
import ModelSelector from "./components/ModelSelector";
import SyntheticPreview from "./components/SyntheticPreview";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";

const GeneratorPage = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [models, setModels] = useState({});
  const [syntheticData, setSyntheticData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 👈 добавили состояние загрузки
  const [genError, setGenError] = useState(null); // 👈 добавили состояние ошибки

  const handleGenerate = async () => {
    setIsLoading(true); // 👈 при старте — включаем лоадер
    setGenError(null); // 👈 сбрасываем ошибку перед началом
    const formData = new FormData();
    formData.append("file", file);
    selectedColumns.forEach((col) => formData.append("columns", col));
    selectedColumns.forEach((col) => formData.append("models", models[col] || "GPT-J"));
    formData.append("samples", 10);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyze-columns/`, formData);
      setSyntheticData(response.data.synthetic);
      setAnalysisResults(response.data.analysis);
    } catch (error) {
      console.error("Error generating synthetic data:", error);
      setGenError(error.message); // 👈 сохраняем сообщение об ошибке
    } finally {
      setIsLoading(false); // 👈 в любом случае — выключаем лоадер
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>SynthData Generator</h1>
      {genError && <p className="text-red-600">{genError}</p>} {/* 👈 отображаем ошибку */}
      <FileUpload onColumnsDetected={setColumns} onFileSelected={setFile} />
      {columns.length > 0 && (
        <>
          <ColumnSelector
            columns={columns}
            selected={selectedColumns}
            setSelected={setSelectedColumns}
          />
          <ModelSelector
            selectedColumns={selectedColumns}
            models={models}
            setModels={setModels}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading} // 👈 блокируем если грузится
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              backgroundColor: isLoading ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            {isLoading ? "Generating..." : "Generate Synthetic Data"} {/* 👈 текст меняется */}
          </button>
        </>
      )}
      {syntheticData && (
        <SyntheticPreview data={syntheticData} analysis={analysisResults} />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<GeneratorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
