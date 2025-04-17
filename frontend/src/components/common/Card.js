import React from "react";

const Card = ({ children, title, className = "", gradientBorder = false }) => {
  const cardClasses = `
    bg-white rounded-lg shadow-md overflow-hidden
    ${gradientBorder ? "gradient-border" : ""}
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {title && (
        <div className="px-4 sm:px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 break-words">
            {title}
          </h3>
        </div>
      )}
      <div className={`${title ? "px-4 sm:px-6 py-3 sm:py-4" : "p-4 sm:p-6"}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
