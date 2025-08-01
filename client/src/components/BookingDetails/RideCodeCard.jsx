import React from "react";
import { FaIdCard } from "react-icons/fa";

const RideCodeCard = ({ uniqueCode }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200">
      <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
        <FaIdCard className="mr-3" />
        Ride Code
      </h2>
      <div className="text-center">
        <p className="text-sm text-blue-700 mb-3 font-medium">
          Share this code with your driver to end the ride:
        </p>
        <div className="bg-white rounded-xl p-4 shadow-inner border-2 border-blue-300">
          <p className="font-mono text-3xl font-bold text-blue-600 tracking-wider">
            {uniqueCode}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RideCodeCard;
