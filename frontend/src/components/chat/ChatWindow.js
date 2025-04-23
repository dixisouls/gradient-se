import React, { useState, useRef, useEffect } from "react";
import chatService from "../../services/chatService";

const ChatWindow = ({ isOpen }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      content:
        "Hi there! I'm Neuron. How can I help you with your studies today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);

  // Focus on input when chat window opens
  useEffect(() => {
    if (isOpen && messageInputRef.current) {
      setTimeout(() => {
        messageInputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);

    // Show typing indicator
    setIsTyping(true);

    try {
      const result = await chatService.sendMessage(userMessage);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { type: "assistant", content: result.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
          error: true,
        },
      ]);
      console.error("Error getting chat response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div
      className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-10rem)] bg-white rounded-xl shadow-2xl z-40 transition-all duration-300 overflow-hidden flex flex-col ${
        isOpen
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-10 pointer-events-none"
      }`}
      style={{ backdropFilter: "blur(10px)" }}
    >
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="5" cy="6" r="1" />
              <circle cx="12" cy="6" r="1" />
              <circle cx="19" cy="6" r="1" />
              <circle cx="5" cy="18" r="1" />
              <circle cx="12" cy="18" r="1" />
              <circle cx="19" cy="18" r="1" />
              <line x1="5" y1="7" x2="5" y2="17" />
              <line x1="12" y1="7" x2="12" y2="17" />
              <line x1="19" y1="7" x2="19" y2="17" />
              <line x1="6" y1="6" x2="11" y2="6" />
              <line x1="13" y1="6" x2="18" y2="6" />
              <line x1="6" y1="18" x2="11" y2="18" />
              <line x1="13" y1="18" x2="18" y2="18" />
            </svg>
          </div>
          <span className="font-bold text-lg">Neuron</span>
        </div>
        <div className="text-xs text-white/70">AI Study Assistant</div>
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : msg.error
                    ? "bg-red-50 text-red-800 rounded-tl-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex mt-4">
            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-gray-500 flex items-center">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="bg-white p-3 border-t border-gray-100 shadow-inner">
        <form
          onSubmit={handleSendMessage}
          className="flex items-end bg-gray-100 rounded-lg p-2"
        >
          <textarea
            ref={messageInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none max-h-32 text-gray-700 py-1 px-2"
            rows={
              message.split("\n").length > 3
                ? 3
                : message.split("\n").length || 1
            }
            disabled={isTyping}
          />
          <button
            type="submit"
            className={`ml-2 p-2 rounded-full bg-blue-600 text-white transition-all transform ${
              !message.trim() || isTyping
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 hover:scale-105"
            }`}
            disabled={!message.trim() || isTyping}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div className="text-xs text-center text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
