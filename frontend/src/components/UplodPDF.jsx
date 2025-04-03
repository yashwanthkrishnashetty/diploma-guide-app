import React, { useState, useEffect } from "react";
import axios from "axios";
import BACKEND from  "./config"

const branches = ["Computer Science", "Mechanical", "Electronics & Communication", "Automobile"];

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [name, setName] = useState("");
  const [pdfs, setPdfs] = useState([]);

  // 📌 Fetch PDFs from the server
  useEffect(() => {
    axios.get(`${BACKEND}/pdfs`)
      .then((response) => setPdfs(response.data))
      .catch((error) => console.error("Error fetching PDFs:", error));
  }, []);

  // 📌 Handle PDF Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("branch", branch);
    formData.append("semester", semester);
    formData.append("name", name);

    try {
      await axios.post(`${BACKEND}/upload`, formData);
      alert("PDF uploaded successfully!");
      window.location.reload(); // Refresh page after upload
    } catch (error) {
      console.error(error);
      alert("Failed to upload PDF");
    }
  };

  return (
    <div className="container">
      <h2>Upload PDF</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        
        {/* Branch Select Dropdown */}
        <select value={branch} onChange={(e) => setBranch(e.target.value)} required>
          <option value="">Select Branch</option>
          {branches.map((b, index) => (
            <option key={index} value={b}>{b}</option>
          ))}
        </select>

        <input type="number" placeholder="Semester" onChange={(e) => setSemester(e.target.value)} required />
        <input type="text" placeholder="Subject Name" onChange={(e) => setName(e.target.value)} required />
        <button type="submit">Upload</button>
      </form>

      <h3>Uploaded PDFs</h3>
      <ul>
        {pdfs.map((pdf, index) => (
          <li key={index}>
            {pdf.name} - <a href={`${BACKEND}${pdf.pdfPath}`} target="_blank" rel="noopener noreferrer">View PDF</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadPDF;
