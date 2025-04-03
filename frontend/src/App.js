import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BranchSelection from "./components/BranchSelection";
import SemesterSelection from "./components/SemesterSelection";
import SubjectSelection from "./components/SubjectSelection";
import PDFViewer from "./components/PDFViewer";
import UploadPDF from "./components/UplodPDF";
import LoginSignup from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSignup setIsLoggedIn={setIsLoggedIn} />} />
        {!isLoggedIn ? (
          <Route path="*" element={<Navigate to="/" />} />
        ) : (
          <>
            <Route path="/" element={<BranchSelection />} />
            <Route path="/semester/:branch" element={<SemesterSelection />} />
            <Route path="/subjects/:branch/:semester" element={<SubjectSelection />} />
            <Route path="/upload" element={<UploadPDF />} />
            <Route path="/pdf-viewer" element={<PDFViewer />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;