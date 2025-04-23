import api from "./api";

const chatService = {
  // Send a prompt to the chat API and get a response
  sendMessage: async (prompt) => {
    try {
      const response = await api.post("/chat", {
        prompt: prompt,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },
};

export default chatService;
