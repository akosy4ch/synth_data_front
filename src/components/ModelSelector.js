import React, { useState } from "react";

const modelOptions = {
  text: ["GPT-J", "FLAN-T5", "MARKOV", "DISTIL-CMLM", "LLAMA-2", "DEEPSEEK"],
  numeric: ["CTGAN", "TVAE", "GMM"],
};

const heavyModels = ["GPT-J", "FLAN-T5", "LLAMA-2", "DEEPSEEK"];

const ModelSelector = ({selectedColumns,
  columnTypes = {}, // default to empty object
  modelConfig,
  setModelConfig
}) => {
  const [isModelSupported, setIsModelSupported] = useState(true);
  // Always use local modelOptions
  const fetchedModelOptions = modelOptions;

  const handleModelChange = (col, model) => {
    setModelConfig((prev) => ({ ...prev, [col]: model }));
    // Simulate backend validation for model support
    const supported = fetchedModelOptions[columnTypes[col] || "text"]?.includes(model);
    setIsModelSupported(supported);
  };

  // Функция для отображения модели с ⚡ если тяжёлая
  const getDisplayName = (model) => {
    return heavyModels.includes(model) ? `${model} ⚡` : model;
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 className="text-xl font-semibold mb-4">Select Generation Model per Column</h3>
      {Array.isArray(selectedColumns) && selectedColumns.map((col) => {
        const type = columnTypes?.[col] || "text"; 
        const selectedModel = modelConfig[col] || "";

        return (
          <div key={col} style={{ marginBottom: "2rem" }}>
            <label className="font-bold">{col}</label> <span>({type})</span>
            <div style={{ marginTop: "0.5rem" }}>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(col, e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">-- select model --</option>
                {fetchedModelOptions[type]?.map((model) => (
                  <option key={model} value={model}>
                    {getDisplayName(model)}
                  </option>
                ))}
              </select>
            </div>

            {/* Алерт если выбрана тяжёлая модель */}
            {heavyModels.includes(selectedModel) && (
              <div className="mt-2 p-3 rounded bg-yellow-100 text-yellow-800 text-sm border border-yellow-400">
                ⚠️ The selected model (<strong>{selectedModel}</strong>) requires a powerful GPU.<br />
                On normal computers it may work extremely slow or fail.
              </div>
            )}

            {/* Предупреждение если модель не поддерживается */}
            {!isModelSupported && (
              <p className="text-red-600">That model isn’t supported for this column.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModelSelector;
