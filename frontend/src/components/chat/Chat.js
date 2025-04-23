import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ChatIcon from "./ChatIcon";
import ChatWindow from "./ChatWindow";
import "../../styles/scrollbar.css";
import "../../styles/chat.css";

const Chat = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Close chat when user logs out
  useEffect(() => {
    if (!currentUser) {
      setIsOpen(false);
    }
  }, [currentUser]);

  // For real implementation, you'd set hasUnreadMessages when new messages arrive
  // This is just for demonstration purposes
  useEffect(() => {
    // Only run timer if user is logged in
    if (!currentUser) return;

    // Simulate a new message after 1 minute if chat is closed
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnreadMessages(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [isOpen, currentUser]);

  const toggleChat = () => {
    if (!currentUser) return;

    setIsOpen(!isOpen);
    if (isOpen === false) {
      setHasUnreadMessages(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  // Render nothing if user is not logged in
  if (!currentUser) {
    return null;
  }

  return (
    <>
      {hasUnreadMessages && !isOpen && (
        <div className="fixed bottom-20 right-6 w-3 h-3 bg-red-500 rounded-full z-50 animate-pulse"></div>
      )}
      <ChatIcon onClick={toggleChat} isOpen={isOpen} />
      <ChatWindow isOpen={isOpen} onClose={closeChat} />
    </>
  );
};

export default Chat;
