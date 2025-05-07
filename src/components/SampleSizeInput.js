import React from "react";

const SampleSizeInput = ({ sampleSize, setSampleSize, recommendedRange = [100, 1000] }) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <label>
        <h3>Number of Synthetic Samples</h3>
        <input
          type="number"
          value={sampleSize}
          min={1}
          onChange={(e) => setSampleSize(Number(e.target.value))}
          style={{ padding: "0.4rem", width: "150px", marginTop: "0.5rem" }}
        />
        <div style={{ fontSize: "0.9rem", color: "#666" }}>
          Recommended range: {recommendedRange[0]}–{recommendedRange[1]} samples
        </div>
      </label>
    </div>
  );
};

export default SampleSizeInput;
