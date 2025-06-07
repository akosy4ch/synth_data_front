import React, { useState } from "react";
import { analyzeColumns } from "../api/dataApi";
import useGeneratorStore from "../components/state_store";

const AnalyzeColumns = () => {
  const analysisResult = useGeneratorStore((s) => s.analysisMetadata);
  const setAnalysisResult = useGeneratorStore((s) => s.setAnalysisMetadata);
  const setColumns = useGeneratorStore((s) => s.setColumns);
  const setFile = useGeneratorStore((s) => s.setFile);

  const [selectedFile, setSelectedFile] = useState(null); // ✅ required
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFile(file); // optional — you can persist just file name
    setAnalysisResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      return setError("Please choose a file first");
    }
    setError("");
    try {
      const res = await analyzeColumns(selectedFile);
      setAnalysisResult(res.data); // persist full analysis
      setColumns(res.data.columns); // for downstream use
    } catch (err) {
      console.error("Column analysis failed", err);
      setError(
        err.response?.status === 401
          ? "You must be logged in to analyze columns."
          : "Column analysis failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 my-6">
      <label className="block font-semibold text-gray-800 mb-2">
        📤 Upload Dataset
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv,.txt,.json,.xlsx,.xls"
        className="mb-3 block w-full text-sm text-gray-700"
      />

      <button
        onClick={handleAnalyze}
        className="btn-gradient mb-2"
        disabled={!selectedFile}
      >
        📊 Analyze Columns
      </button>

      {error && (
        <div className="alert-error mt-2">{error}</div>
      )}

      {analysisResult && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Detected Columns
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-gray-800 bg-white shadow-sm rounded-md overflow-hidden">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Unique</th>
                  <th className="px-4 py-2 text-left">Sample</th>
                  <th className="px-4 py-2 text-left">Avg Length</th>
                </tr>
              </thead>
              <tbody>
                {analysisResult.columns.map((col) => (
                  <tr key={col.name} className="border-b last:border-none">
                    <td className="px-4 py-2">{col.name}</td>
                    <td className="px-4 py-2">{col.dtype}</td>
                    <td className="px-4 py-2">{col.unique_values}</td>
                    <td className="px-4 py-2">
                      {col.sample?.[0] ?? "-"}
                    </td>
                    <td className="px-4 py-2">
                      {col.avg_length != null
                        ? col.avg_length.toFixed(1)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-gray-700 text-sm">
            Total rows:{" "}
            <span className="font-semibold">
              {analysisResult.rows}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzeColumns;
