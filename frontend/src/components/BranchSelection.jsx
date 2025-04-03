import React from "react";
import { useNavigate } from "react-router-dom";

const branches = ["Computer Science", "Mechanical", "Electronics & Communication", "Automobile"];

const BranchSelection = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center mt-10 relative w-full">
      {/* Logout Button at the Top */}
      <button 
        onClick={handleLogout} 
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>

      {/* Main Heading */}
      <h1 className="text-3xl font-extrabold text-blue-600 mb-6">Diploma Guide App</h1>

      {/* Subheading */}
      <h2 className="text-2xl font-bold mb-5">Select Your Diploma Branch</h2>

      {/* Grid for Branch Selection */}
      <div className="grid grid-cols-2 gap-4">
        {branches.map((branch, index) => (
          <button
            key={index}
            className="branch-button"
            onClick={() => navigate(`/semester/${branch}`)}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* Check Result Button */}
      <a href="https://bte-linx.web.app/" target="_blank" rel="noopener noreferrer">
        <button className="result-button">📜 Check Result</button>
      </a>
    </div>
  );
};

export default BranchSelection;
