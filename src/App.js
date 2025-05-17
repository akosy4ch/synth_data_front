import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import FileUpload from "./components/FileUpload";
import ColumnSelector from "./components/ColumnSelector";
import ModelSelector from "./components/ModelSelector";
import SyntheticPreview from "./components/SyntheticPreview";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AnalyzeColumns from "./components/AnalyzeColumns";
import DetectConfig from "./components/DetectConfig";
import axios from "axios";

const GeneratorPage = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [models, setModels] = useState({});
  const [syntheticData, setSyntheticData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genError, setGenError] = useState(null);
  const [preserveOtherColumns, setPreserveOtherColumns] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGenError(null);
    const formData = new FormData();
    formData.append("file", file);
    selectedColumns.forEach((col) => formData.append("columns", col));
    selectedColumns.forEach((col) => formData.append("models", models[col] || "GPT-J"));
    formData.append("samples", 10);
    formData.append("preserve_other_columns", preserveOtherColumns);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate-synthetic/`, formData);
      setSyntheticData(response.data.synthetic);
      setAnalysisResults(response.data.analysis);
    } catch (error) {
      console.error("Error generating synthetic data:", error);
      // Show backend error detail, message, and stack if available
      setGenError(
        (error.response?.data?.detail && (
          <div>
            <div>{error.response.data.detail}</div>
            {error.response.data.stack && (
              <pre style={{ color: "#a00", fontSize: "0.9em", marginTop: "0.5em" }}>
                {error.response.data.stack}
              </pre>
            )}
          </div>
        )) ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>SynthData Generator</h1>

      <AnalyzeColumns setColumns={setColumns} setFile={setFile} />
      <DetectConfig file={file} setModels={setModels} setColumns={setColumns} />

      {columns.length > 0 && (
        <>
          <ColumnSelector
            columns={columns}
            selected={selectedColumns}
            setSelected={setSelectedColumns}
          />
          <ModelSelector
            selectedColumns={selectedColumns}
            columnTypes={Object.fromEntries(
              columns.map(col => [
                col.name,
                (
                  col.dtype &&
                  [
                    "int", "int64", "int32", "float", "float64", "float32", "number", "numeric"
                  ].some(type => col.dtype.toLowerCase().includes(type))
                )
                  ? "numeric"
                  : "text"
              ])
            )}
            modelConfig={models}
            setModelConfig={setModels}
          />
          <div style={{ marginTop: "1rem" }}>
            <label>
              <input
                type="checkbox"
                checked={preserveOtherColumns}
                onChange={e => setPreserveOtherColumns(e.target.checked)}
                style={{ marginRight: "0.5rem" }}
              />
              Preserve other columns
            </label>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
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
            {isLoading ? "Generating..." : "Generate Synthetic Data"}
          </button>
        </>
      )}

      {genError && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          {typeof genError === "string" ? genError : genError}
        </div>
      )}

      {syntheticData && (
        <SyntheticPreview data={syntheticData} analysis={analysisResults} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<GeneratorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
