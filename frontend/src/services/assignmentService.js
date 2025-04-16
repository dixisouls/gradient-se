import api from "./api";

const assignmentService = {
  // Get all assignments
  getAllAssignments: async (courseId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.skip) queryParams.append("skip", params.skip);
    if (params.limit) queryParams.append("limit", params.limit);

    const endpoint = courseId
      ? `/courses/${courseId}/assignments?${queryParams.toString()}`
      : `/assignments?${queryParams.toString()}`;

    const response = await api.get(endpoint);
    return response.data;
  },

  // Get assignment by ID
  getAssignmentById: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  // Create assignment
  createAssignment: async (assignmentData, referenceFile = null) => {
    // Always use FormData
    const formData = new FormData();

    // Ensure course_id is included and is explicitly set first
    if (!assignmentData.course_id) {
      throw new Error("Course ID is required");
    }

    // Explicitly add course_id first
    formData.append("course_id", assignmentData.course_id);

    // Add all other assignment data
    for (const [key, value] of Object.entries(assignmentData)) {
      if (key !== "course_id" && value !== undefined && value !== null) {
        // Convert boolean to string for proper form data handling
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value);
        }
      }
    }

    // Add the reference solution file
    if (referenceFile) {
      formData.append("reference_solution_file", referenceFile);
    }

    // Log the FormData entries to debug
    console.log("Form data being sent:");
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await api.post("/assignments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update assignment
  updateAssignment: async (
    assignmentId,
    assignmentData,
    referenceFile = null
  ) => {
    // Always use FormData for consistency
    const formData = new FormData();

    // Add all assignment data
    for (const [key, value] of Object.entries(assignmentData)) {
      if (value !== undefined && value !== null) {
        // Convert boolean to string for proper form data handling
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value);
        }
      }
    }

    // Add the reference solution file if provided
    if (referenceFile) {
      formData.append("reference_solution_file", referenceFile);
    }

    const response = await api.put(`/assignments/${assignmentId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Delete assignment
  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/assignments/${assignmentId}`);
    return response.data;
  },
};

export default assignmentService;
