import React from "react";

const ChatIcon = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50 transition-all duration-300 transform hover:scale-105 ${
        isOpen
          ? "opacity-0 pointer-events-none" // Hide when chat is open
          : "bg-gradient-to-r from-blue-600 to-purple-600 opacity-100"
      }`}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {/* Always show neuron icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Cell body (soma) */}
        <circle
          cx="12"
          cy="12"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Dendrites */}
        <path
          d="M12 8.5C12 8.5 13 5.5 11 3.5C9 1.5 5 2 3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9 9.5C9 9.5 6 7.5 3.5 8.5C1 9.5 1 13 2 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9.5 14C9.5 14 7 16 7 18.5C7 21 9 22 11 22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Axon */}
        <path
          d="M15 11C15 11 19 9.5 20.5 11C22 12.5 21 16 20 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14.5 14.5C14.5 14.5 17 17 15.5 19.5C14 22 10 22 9 21.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M15 9.5C15 9.5 18 8 20 5.5C22 3 21 1 19.5 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Synaptic terminals */}
        <circle cx="2.5" cy="3.5" r="0.75" fill="currentColor" />
        <circle cx="1.5" cy="14.5" r="0.75" fill="currentColor" />
        <circle cx="11" cy="22" r="0.75" fill="currentColor" />
        <circle cx="8.5" cy="21.5" r="0.75" fill="currentColor" />
        <circle cx="20" cy="18" r="0.75" fill="currentColor" />
        <circle cx="19.5" cy="2" r="0.75" fill="currentColor" />
      </svg>
    </button>
  );
};

export default ChatIcon;
