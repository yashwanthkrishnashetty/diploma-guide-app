import React from "react";
import { useLocation } from "react-router-dom";
import BACKEND from  "./config"

const PDFViewer = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pdfName = params.get("pdf"); // Get PDF name from URL query

  if (!pdfName) {
    return <p className="text-center mt-10 text-red-500">No PDF selected</p>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <iframe
        src={`${BACKEND}/uploads/${pdfName}.pdf`} // ✅ Correct URL
        width="80%"
        height="600px"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;
