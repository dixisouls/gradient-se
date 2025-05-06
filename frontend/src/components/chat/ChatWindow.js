import React, { useState, useRef, useEffect } from "react";
import chatService from "../../services/chatService";

// Custom function to render Markdown-like formatting
const renderMarkdown = (text) => {
  if (!text) return "";

  // Process the text line by line to handle block elements properly
  const lines = text.split("\n");
  let inList = false;
  let inOrderedList = false;
  let inCodeBlock = false;
  let inBlockquote = false;
  let formattedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check for code blocks (```code```)
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        formattedLines.push(
          '<pre class="bg-gray-100 p-2 rounded-md text-gray-800 overflow-x-auto my-2"><code>'
        );
        // Skip the opening ```
        continue;
      } else {
        // End of code block
        inCodeBlock = false;
        formattedLines.push("</code></pre>");
        continue;
      }
    }

    // If we're in a code block, don't process other formatting
    if (inCodeBlock) {
      formattedLines.push(escapeHTML(line));
      continue;
    }

    // Check for block quotes (> text)
    if (line.trim().startsWith("> ")) {
      const quoteContent = line.trim().substring(2);
      if (!inBlockquote) {
        inBlockquote = true;
        formattedLines.push(
          '<blockquote class="border-l-4 border-gray-300 pl-3 py-1 italic text-gray-600 my-2">'
        );
      }
      formattedLines.push(formatInlineMarkdown(escapeHTML(quoteContent)));
    } else if (inBlockquote) {
      inBlockquote = false;
      formattedLines.push("</blockquote>");
      i--; // Process this line again, now that we're out of the blockquote
      continue;
    }

    // Check for headers (# Header)
    if (line.trim().match(/^#{1,6}\s/)) {
      const level = line.trim().match(/^(#{1,6})\s/)[1].length;
      const headerText = line.trim().substring(level + 1);
      formattedLines.push(
        `<h${level} class="font-bold text-${
          level === 1 ? "xl" : level === 2 ? "lg" : "md"
        } my-2">${formatInlineMarkdown(escapeHTML(headerText))}</h${level}>`
      );
      continue;
    }

    // Check for unordered lists (* item or - item)
    if (line.trim().match(/^[*-]\s/)) {
      const listItem = line.trim().substring(2);
      if (!inList) {
        inList = true;
        formattedLines.push('<ul class="list-disc ml-5 my-2">');
      }
      formattedLines.push(
        `<li>${formatInlineMarkdown(escapeHTML(listItem))}</li>`
      );
    }
    // Check for ordered lists (1. item)
    else if (line.trim().match(/^\d+\.\s/)) {
      const listItem = line.trim().replace(/^\d+\.\s/, "");
      if (!inOrderedList) {
        inOrderedList = true;
        formattedLines.push('<ol class="list-decimal ml-5 my-2">');
      }
      formattedLines.push(
        `<li>${formatInlineMarkdown(escapeHTML(listItem))}</li>`
      );
    }
    // Regular paragraph text
    else {
      // Close any open lists
      if (inList) {
        inList = false;
        formattedLines.push("</ul>");
      }
      if (inOrderedList) {
        inOrderedList = false;
        formattedLines.push("</ol>");
      }

      // Handle regular paragraph text (skip empty lines)
      if (line.trim() !== "") {
        formattedLines.push(
          `<p class="my-1">${formatInlineMarkdown(escapeHTML(line))}</p>`
        );
      } else {
        formattedLines.push("<br>");
      }
    }
  }

  // Close any open blocks
  if (inList) formattedLines.push("</ul>");
  if (inOrderedList) formattedLines.push("</ol>");
  if (inBlockquote) formattedLines.push("</blockquote>");
  if (inCodeBlock) formattedLines.push("</code></pre>");

  return formattedLines.join("");
};

// Format inline markdown elements: bold, italic, code, links
const formatInlineMarkdown = (text) => {
  // Bold (**text**)
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic (*text*)
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Inline code (`code`)
  text = text.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>'
  );

  // Links ([text](url))
  text = text.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return text;
};

// Helper function to escape HTML characters
const escapeHTML = (text) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const ChatWindow = ({ isOpen, onClose, isPreLogin = false }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      content: isPreLogin
        ? "Hi there! I'm Neuron. I can help answer questions about GRADiEnt. How can I help you today?"
        : "Hi there! I'm Neuron. How can I help you with your studies today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);

  // Update welcome message when login state changes
  useEffect(() => {
    setMessages([
      {
        type: "assistant",
        content: isPreLogin
          ? "Hi there! I'm Neuron. I can help answer questions about GRADiEnt. How can I help you today?"
          : "Hi there! I'm Neuron. How can I help you with your studies today?",
      },
    ]);
  }, [isPreLogin]);

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
      // Use different endpoint based on login state
      const endpoint = isPreLogin ? "chat/guest" : "chat";
      const result = await chatService.sendMessage(userMessage, endpoint);

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

  // Format timestamps
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-20 z-30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose} // Close when clicking backdrop
      />

      {/* Main chat window */}
      <div
        className={`fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-2xl z-40 transition-all duration-300 overflow-hidden flex flex-col ${
          isOpen
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-10 pointer-events-none"
        }`}
      >
        {/* Chat header */}
        <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
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
              </div>
            </div>
            <div className="ml-3">
              <div className="font-bold text-gray-800">Neuron</div>
              <div className="text-xs text-gray-500">
                {isPreLogin ? "AI Assistant" : "AI Study Assistant"}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
              onClick={onClose}
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 bg-gradient-to-b from-blue-50/50 to-purple-50/50"
        >
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0 mr-2 mt-1 flex items-center justify-center">
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
                      <path d="M12 8.5V12l3 1.5"></path>
                      <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                    </svg>
                  </div>
                )}

                <div
                  className={`max-w-[75%] p-3 ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-sm"
                      : msg.error
                      ? "bg-red-50 text-red-800 rounded-2xl rounded-tl-none shadow-sm border border-red-100"
                      : "bg-white text-gray-700 rounded-2xl rounded-tl-none shadow-sm border border-gray-100"
                  }`}
                >
                  {msg.type === "user" ? (
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  ) : (
                    <div
                      className="markdown-content text-sm"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(msg.content),
                      }}
                    ></div>
                  )}
                  <div
                    className={`text-right mt-1 text-xs ${
                      msg.type === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {formatTime()}
                  </div>
                </div>

                {msg.type === "user" && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 ml-2 mt-1 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex mt-4 items-end">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0 mr-2 flex items-center justify-center">
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
                  <path d="M12 8.5V12l3 1.5"></path>
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                </svg>
              </div>
              <div className="bg-white text-gray-500 rounded-2xl rounded-tl-none py-3 px-4 shadow-sm border border-gray-100">
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

        {/* Message suggestions */}
        <div className="bg-white px-5 py-3 flex overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hide-scrollbar">
          {isPreLogin ? (
            // Pre-login suggestions
            <>
              <button
                className="flex-shrink-0 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 whitespace-nowrap mr-2 hover:bg-blue-100 transition-colors"
                onClick={() => setMessage("What features does GRADiEnt offer?")}
              >
                GRADiEnt features
              </button>
              <button
                className="flex-shrink-0 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 whitespace-nowrap mr-2 hover:bg-blue-100 transition-colors"
                onClick={() => setMessage("How do I register for an account?")}
              >
                Registration
              </button>
              <button
                className="flex-shrink-0 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 whitespace-nowrap hover:bg-blue-100 transition-colors"
                onClick={() => setMessage("What courses are available?")}
              >
                Available courses
              </button>
            </>
          ) : (
            // Post-login suggestions
            <>
              <button
                className="flex-shrink-0 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 whitespace-nowrap mr-2 hover:bg-blue-100 transition-colors"
                onClick={() =>
                  setMessage("Can you help me understand neural networks?")
                }
              >
                Neural networks
              </button>
              <button
                className="flex-shrink-0 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 whitespace-nowrap mr-2 hover:bg-blue-100 transition-colors"
                onClick={() =>
                  setMessage("How do I solve quadratic equations?")
                }
              >
                Quadratic equations
              </button>
              <button
                className="flex-shrink-0 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 whitespace-nowrap hover:bg-blue-100 transition-colors"
                onClick={() =>
                  setMessage("Explain the concept of reinforcement learning")
                }
              >
                Reinforcement learning
              </button>
            </>
          )}
        </div>

        {/* Chat input */}
        <div className="bg-white p-4 border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-gray-100 border-0 rounded-2xl pl-4 pr-12 py-3 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors resize-none max-h-32 text-gray-700"
              rows={
                message.split("\n").length > 3
                  ? 3
                  : message.split("\n").length || 1
              }
              disabled={isTyping}
            />
            <button
              type="submit"
              className={`absolute right-3 bottom-3 p-2 rounded-full transition-all transform ${
                !message.trim() || isTyping
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
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

          <div className="flex justify-end items-center mt-2">
            <div className="text-xs text-gray-400">
              Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
