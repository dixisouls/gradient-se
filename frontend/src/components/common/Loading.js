import React from "react";

const Loading = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          border-r-transparent 
          border-gradient-primary
          animate-spin
        `}
      />
    </div>
  );
};

export default Loading;
