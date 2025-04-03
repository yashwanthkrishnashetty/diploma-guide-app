import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUpload, FaSignOutAlt, FaEye } from "react-icons/fa"; // Import icons
import "./Dashboard.css"; // Import CSS

const Dashboard = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [name, setName] = useState("");
  const [pdfs, setPdfs] = useState([]);

  // List of branches
  const branches = ["Computer Science", "Automobile", "Mechanical", "Electronics & Communication"];

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/");
    }

    axios
      .get("http://localhost:5000/pdfs")
      .then((response) => setPdfs(response.data))
      .catch((error) => console.error("Error fetching PDFs:", error));
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("branch", branch);
    formData.append("semester", semester);
    formData.append("name", name);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("PDF uploaded successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to upload PDF");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📚 Admin Dashboard</h2>
      <button onClick={handleLogout} className="logout-button">
        <FaSignOutAlt className="icon" /> Logout
      </button>

      <form onSubmit={handleUpload} className="upload-form">
        <label className="file-input">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          <span>📁 Choose File</span>
        </label>

        {/* Dropdown for selecting branch */}
        <select value={branch} onChange={(e) => setBranch(e.target.value)} required className="dropdown">
          <option value="" disabled>Select Branch</option>
          {branches.map((b, index) => (
            <option key={index} value={b}>{b}</option>
          ))}
        </select>

        <input type="number" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} required />
        <input type="text" placeholder="Subject Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit" className="upload-button">
          <FaUpload className="icon" /> Upload PDF
        </button>
      </form>

      <h3 className="uploaded-title">📂 Uploaded PDFs</h3>
      <ul className="pdf-list">
        {pdfs.map((pdf, index) => (
          <li key={index} className="pdf-item">
            <span>{pdf.name}</span>
            <a href={`http://localhost:5000${pdf.pdfPath}`} target="_blank" rel="noopener noreferrer" className="view-link">
              <FaEye className="icon" /> View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
