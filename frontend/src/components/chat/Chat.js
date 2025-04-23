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
  const [isPreLogin, setIsPreLogin] = useState(!currentUser);

  // Update pre-login state when auth changes
  useEffect(() => {
    setIsPreLogin(!currentUser);
  }, [currentUser]);

  // For real implementation, you'd set hasUnreadMessages when new messages arrive
  // This is just for demonstration purposes
  useEffect(() => {
    // Simulate a new message after 1 minute if chat is closed
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnreadMessages(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen === false) {
      setHasUnreadMessages(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {hasUnreadMessages && !isOpen && (
        <div className="fixed bottom-20 right-6 w-3 h-3 bg-red-500 rounded-full z-50 animate-pulse"></div>
      )}
      <ChatIcon onClick={toggleChat} isOpen={isOpen} />
      <ChatWindow isOpen={isOpen} onClose={closeChat} isPreLogin={isPreLogin} />
    </>
  );
};

export default Chat;
