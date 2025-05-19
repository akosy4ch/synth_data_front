import React, { useState, useEffect } from "react";
import axios from "axios";

const EvaluateTextsFromMinIO = () => {
  const [originalFiles, setOriginalFiles] = useState([]);
  const [syntheticFiles, setSyntheticFiles] = useState([]);
  const [originalPath, setOriginalPath] = useState("");
  const [syntheticPath, setSyntheticPath] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/list-objects/`);
        const allObjects = response.data.objects;

        // Разделим на original и synthetic по имени файла
        const originals = allObjects.filter((obj) =>
          obj.toLowerCase().includes("original")
        );
        const synthetics = allObjects.filter((obj) =>
          obj.toLowerCase().includes("synthetic")
        );

        setOriginalFiles(originals);
        setSyntheticFiles(synthetics);
      } catch (err) {
        console.error("Failed to load MinIO files", err);
      }
    };
    fetchObjects();
  }, []);

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/evaluate-texts/`,
        {
          original_s3_path: originalPath,
          synthetic_s3_path: syntheticPath,
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 my-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 Evaluate Synthetic Texts (from MinIO)</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">🗂 Select Original Dataset</label>
      <select
        value={originalPath}
        onChange={(e) => setOriginalPath(e.target.value)}
        className="mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring focus:ring-blue-200"
      >
        <option value="">-- Select original dataset --</option>
        {originalFiles.map((obj) => (
          <option key={obj} value={obj}>
            {obj.replace("uploads/", "")}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1">🗂 Select Synthetic Dataset</label>
      <select
        value={syntheticPath}
        onChange={(e) => setSyntheticPath(e.target.value)}
        className="mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring focus:ring-blue-200"
      >
        <option value="">-- Select synthetic dataset --</option>
        {syntheticFiles.map((obj) => (
          <option key={obj} value={obj}>
            {obj.replace("uploads/", "")}
          </option>
        ))}
      </select>

      <button
        onClick={handleEvaluate}
        disabled={loading || !originalPath || !syntheticPath}
        className="btn-gradient"
      >
        {loading ? "Evaluating..." : "📈 Evaluate"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📄 Results</h3>
          <div className="overflow-x-auto text-sm text-gray-800 bg-gray-50 p-4 rounded-md shadow-inner">
            <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluateTextsFromMinIO;
