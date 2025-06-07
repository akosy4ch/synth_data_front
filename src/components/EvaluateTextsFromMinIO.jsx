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
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

        const [origRes, synthRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/user-files/?file_type=original`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/user-files/?file_type=synthetic`, { headers })
        ]);

        setOriginalFiles(origRes.data);  // [{filename, s3_path}]
        setSyntheticFiles(synthRes.data);

      } catch (err) {
        console.error("Failed to load user files", err);
      }
    };
    fetchObjects();
  }, []);

const handleEvaluate = async () => {
  setLoading(true);
  setError(null);
  setResult(null);

  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/evaluate-texts/`,
      {
        original_s3_path: originalPath,    // e.g. "synth-data/uploads/original_file.csv"
        synthetic_s3_path: syntheticPath   // e.g. "synth-data/uploads/synthetic_file.csv"
      }
    ).then(response => setResult(response.data));
  } catch (err) {
    setError(err.response?.data?.detail || "Evaluation failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 my-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 Evaluate Synthetic Texts</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">🗂 Select Original Dataset</label>
      <select
        value={originalPath}
        onChange={(e) => setOriginalPath(e.target.value)}
        className="mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring focus:ring-blue-200"
      >
        <option value="">-- Select original dataset --</option>
        {originalFiles.map((f) => (
          <option key={f.s3_path} value={f.s3_path}>
            {f.filename}
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
        {syntheticFiles.map((f) => (
          <option key={f.s3_path} value={f.s3_path}>
            {f.filename}
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
    <h3 className="text-lg font-semibold mb-4 text-gray-800">📄 Evaluation Results</h3>

    <div className="bg-gray-50 p-4 rounded-md shadow-inner mb-4">
      <h4 className="text-md font-semibold mb-2">🧾 Meta</h4>
      <p><strong>Original Column:</strong> {result.original_column}</p>
      <p><strong>Synthetic Column:</strong> {result.synthetic_column}</p>
      <p><strong>Compared Samples:</strong> {result.num_compared}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
        <h4 className="font-semibold mb-2 text-blue-700">📘 Original Stats</h4>
        <pre className="text-sm whitespace-pre-wrap text-gray-800">
          {JSON.stringify(result.original_stats, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
        <h4 className="font-semibold mb-2 text-green-700">🤖 Synthetic Stats</h4>
        <pre className="text-sm whitespace-pre-wrap text-gray-800">
          {JSON.stringify(result.synthetic_stats, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
        <h4 className="font-semibold mb-2 text-purple-700">📊 Comparison</h4>
        <pre className="text-sm whitespace-pre-wrap text-gray-800">
          {JSON.stringify(result.comparison, null, 2)}
        </pre>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default EvaluateTextsFromMinIO;
