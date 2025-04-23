import React from "react";

const ChatIcon = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50 transition-all duration-300 transform hover:scale-105 ${
        isOpen
          ? "bg-red-500 hover:bg-red-600 rotate-45"
          : "bg-gradient-to-r from-blue-600 to-purple-600"
      }`}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        // X icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        // Neural network icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="5" cy="6" r="2" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="12" cy="18" r="2" />
          <circle cx="19" cy="18" r="2" />
          <line x1="5" y1="8" x2="5" y2="16" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="19" y1="8" x2="19" y2="16" />
          <line x1="7" y1="6" x2="10" y2="6" />
          <line x1="14" y1="6" x2="17" y2="6" />
          <line x1="7" y1="18" x2="10" y2="18" />
          <line x1="14" y1="18" x2="17" y2="18" />
        </svg>
      )}
    </button>
  );
};

export default ChatIcon;
