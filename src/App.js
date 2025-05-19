import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GeneratorPage from "./pages/GeneratorPage";
import MyFilesList from "./components/MyFilesList";
import EvaluateTextsFromMinIO from "./components/EvaluateTextsFromMinIO";
import './styles.css';




function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<GeneratorPage />} />
            <Route path="/my-files" element={<MyFilesList />} />
            <Route path="/evaluate" element={<EvaluateTextsFromMinIO />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
