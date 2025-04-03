import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const SemesterSelection = () => {
  const navigate = useNavigate();
  const { branch } = useParams();

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-5">Select a Semester</h1>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((semester) => (
          <button
            key={semester}
            className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-700"
            onClick={() => navigate(`/subjects/${branch}/${semester}`)}
          >
            Semester {semester}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SemesterSelection;
