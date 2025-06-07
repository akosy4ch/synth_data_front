import React, { useEffect, useState } from "react";
import axios from "axios";

const MyFilesList = () => {
  const [originals, setOriginals] = useState([]);
  const [synthetics, setSynthetics] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [originalRes, syntheticRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/user-files/?file_type=original`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/user-files/?file_type=synthetic`, { headers }),
        ]);

        setOriginals(originalRes.data);
        setSynthetics(syntheticRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch files");
      }
    };

    if (token) fetchFiles();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📁 My Uploaded Files</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">📄 Original Datasets</h3>
          <ul className="list-disc list-inside">
          {originals.map((f, i) => (
            <li key={i} className="text-sm text-gray-700">
              📄 {f.filename} <br />
              <span className="text-xs text-gray-500">{f.s3_path}</span>
            </li>
          ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">🤖 Synthetic Datasets</h3>
        <ul className="list-disc list-inside">
         {synthetics.map((f, i) => (
          <li key={i} className="text-sm text-gray-700">
          🤖 {f.filename} <br />
           <span className="text-xs text-gray-500">{f.s3_path}</span>
          </li>
         ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyFilesList;
