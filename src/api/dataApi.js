import api from "./api";

export const analyzeColumns = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/analyze-columns/", form);
};

export const detectConfig = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/detect-best-config/", form);
};

export const generateSynthetic = (formData) =>
  api.post("/generate-synthetic/", formData);

export const evaluateTexts = (payload) =>
  api.post("/evaluate-texts/", payload);

export const getUserFiles = (type) =>
  api.get(`/user-files/?file_type=${type}`);
