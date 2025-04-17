import React from "react";

const GradientButton = ({
  children,
  onClick,
  type = "button",
  size = "md",
  disabled = false,
  className = "",
  fullWidth = false,
}) => {
  const baseClasses =
    "font-medium rounded-md focus:outline-none transition-all text-white";

  const gradientClasses =
    "bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary hover:brightness-110 active:brightness-90";

  const sizeClasses = {
    sm: "py-1 px-2 sm:px-3 text-xs sm:text-sm",
    md: "py-2 px-3 sm:px-4 text-sm sm:text-base",
    lg: "py-2 sm:py-3 px-4 sm:px-6 text-base sm:text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  const buttonClasses = `
    ${baseClasses} 
    ${gradientClasses} 
    ${sizeClasses[size]} 
    ${widthClass} 
    ${disabledClass} 
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default GradientButton;
