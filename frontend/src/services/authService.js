import api from "./api";

const authService = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/auth/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/users/me", userData);
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  },
};

export default authService;
