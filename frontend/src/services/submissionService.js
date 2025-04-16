import api from "./api";

const submissionService = {
  // Get all submissions with filtering options
  getSubmissions: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.assignmentId)
      queryParams.append("assignment_id", params.assignmentId);
    if (params.userId) queryParams.append("user_id", params.userId);

    const response = await api.get(`/submissions?${queryParams.toString()}`);
    return response.data;
  },

  // Get user's submissions for a specific assignment
  getUserSubmissionsByAssignment: async (assignmentId) => {
    const response = await api.get(
      `/submissions?assignment_id=${assignmentId}`
    );
    return response.data;
  },

  // Get submission by ID
  getSubmissionById: async (submissionId) => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  },

  // Create a submission
  createSubmission: async (
    assignmentId,
    submissionText = null,
    file = null
  ) => {
    const formData = new FormData();
    formData.append("assignment_id", assignmentId);

    // Add submission text if provided
    if (submissionText) {
      formData.append("submission_text", submissionText);
    }

    // Add file if provided
    if (file) {
      formData.append("file", file);
    }

    const response = await api.post("/submissions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Manually trigger grading for a submission (professors only)
  gradeSubmission: async (submissionId, strictness = "Medium") => {
    const response = await api.post(`/submissions/${submissionId}/grade`, {
      strictness: strictness,
    });

    return response.data;
  },

  // Accept a submission's grade (professors only)
  acceptSubmissionGrade: async (submissionId) => {
    const response = await api.post(`/submissions/${submissionId}/accept`);
    return response.data;
  },

  // Get all submissions for an assignment (professors only)
  getSubmissionsByAssignment: async (assignmentId) => {
    const response = await api.get(
      `/submissions?assignment_id=${assignmentId}`
    );
    return response.data;
  },
};

export default submissionService;
