import React from "react";

const Alert = ({ type = "info", message, onClose, className = "" }) => {
  const types = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={`px-4 py-3 mb-4 rounded-md border ${types[type]} ${className}`}
    >
      <div className="flex justify-between">
        <div className="flex-1">{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
