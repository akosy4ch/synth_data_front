import React, { useState } from "react";
import AnalyzeColumns from "../components/AnalyzeColumns";
import DetectConfig from "../components/DetectConfig";
import ColumnSelector from "../components/ColumnSelector";
import ModelSelector from "../components/ModelSelector";
import SyntheticPreview from "../components/SyntheticPreview";
import { generateSynthetic } from "../api/dataApi";

export default function GeneratorPage() {
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
    selectedColumns.forEach(col => formData.append("columns", col));
    selectedColumns.forEach(col => formData.append("models", models[col] || "GPT-J"));
    formData.append("samples", 10);
    formData.append("preserve_other_columns", preserveOtherColumns);

    try {
      // Вот здесь вызывается generateSynthetic, который обращается к эндпоинту generate-synthetic
      const res = await generateSynthetic(formData);
      setSyntheticData(res.data.synthetic);
      setAnalysisResults(res.data.analysis);
    } catch (err) {
      console.error(err);
      setGenError(err.response?.data?.detail || err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="card">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">SynthData Generator</h1>

        <AnalyzeColumns setColumns={setColumns} setFile={setFile} />
        <DetectConfig file={file} setColumns={setColumns} setModels={setModels} />

        {columns.length > 0 && (
          <>
            <ColumnSelector
              columns={columns}
              selected={selectedColumns}
              setSelected={setSelectedColumns}
            />
            <ModelSelector
              selectedColumns={selectedColumns}
              modelConfig={models}
              setModelConfig={setModels}
              columnTypes={Object.fromEntries(
                columns.map(col => [
                  col.name,
                  ["int","float","number"].some(t => col.dtype.toLowerCase().includes(t))
                    ? "numeric"
                    : "text"
                ])
              )}
            />
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={preserveOtherColumns}
                  onChange={e => setPreserveOtherColumns(e.target.checked)}
                  className="mr-2"
                />
                Preserve other columns
              </label>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="btn-gradient mt-4 w-full"
            >
              {isLoading ? "Generating..." : "Generate Synthetic Data"}
            </button>
          </>
        )}

        {genError && (
          <div className="alert-error mt-4">{genError}</div>
        )}

        {syntheticData && (
          <div className="mt-6">
            <SyntheticPreview data={syntheticData} analysis={analysisResults} />
          </div>
        )}
      </div>
    </div>
  );
}
