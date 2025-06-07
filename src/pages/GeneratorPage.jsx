import React, { useState, useEffect } from "react";
import AnalyzeColumns from "../components/AnalyzeColumns";
import DetectConfig from "../components/DetectConfig";
import ColumnSelector from "../components/ColumnSelector";
import ModelSelector from "../components/ModelSelector";
import SyntheticPreview from "../components/SyntheticPreview";
import { generateSynthetic } from "../api/dataApi";
import useGeneratorStore from "../components/state_store";

export default function GeneratorPage() {
  const {
    file, columns, selectedColumns, models, syntheticData, analysisResults, preserveOtherColumns,
    setFile, setColumns, setSelectedColumns, setModels, setSyntheticData, setAnalysisResults, setPreserveOtherColumns, reset
  } = useGeneratorStore();

  const [isLoading, setIsLoading] = useState(false);
  const [genError, setGenError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [restoreNotice, setRestoreNotice] = useState(false);

  useEffect(() => {
    if (columns.length > 0 && !syntheticData) {
      setRestoreNotice(true); // show message if data was restored
    }
  }, [columns, syntheticData]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGenError(null);
    setSuccessMsg(null);
    const formData = new FormData();
    formData.append("file", file);
    selectedColumns.forEach(col => formData.append("columns", col));
    selectedColumns.forEach(col => formData.append("models", models[col] || "GPT-J"));
    formData.append("samples", 10);
    formData.append("preserve_other_columns", String(preserveOtherColumns));


    try {
      // Вот здесь вызывается generateSynthetic, который обращается к эндпоинту generate-synthetic
      const res = await generateSynthetic(formData);
      setSyntheticData(res.data.synthetic);
      setAnalysisResults(res.data.analysis);
      setSuccessMsg("✅ Synthetic data generated successfully!");
    }catch (err) {
    console.error("❌ API error:", JSON.stringify(err, null, 2));
    setGenError(err.response?.data?.detail || err.message || "Unknown error");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="card">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">SynthData Generator</h1>

        {restoreNotice && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 border border-yellow-300">
          🔄 Your last session was restored. You can continue where you left off.
        </div>
      )}

      {(columns.length > 0 || syntheticData) && (
          <div className="flex justify-end mb-4">
        <button
          onClick={reset}
          className="text-sm text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-100 transition"
          title="Clear session data">
          🧹 Clear Session
          </button>
          </div>
        )}
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
              disabled={isLoading || selectedColumns.length === 0}
              className="btn-gradient mt-4 w-full"
            >
              {isLoading ? "Generating..." : "Generate Synthetic Data"}
            </button>
          </>
        )}
        {successMsg && (
          <div className="alert-success mt-4">{successMsg}</div>
        )}
        {genError && (
          <div className="alert-error mt-4">
            {typeof genError === "string"
              ? genError
              : Array.isArray(genError)
                ? genError.map((e, i) => <div key={i}>⚠️ {e.msg}</div>)
                : JSON.stringify(genError)}
          </div>
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
