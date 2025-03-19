import api from "./api";

const courseService = {
  getAllCourses: async (params = {}) => {
    const { skip = 0, limit = 100, term } = params;
    const queryParams = new URLSearchParams();

    queryParams.append("skip", skip);
    queryParams.append("limit", limit);
    if (term) {
      queryParams.append("term", term);
    }

    const response = await api.get(`/courses?${queryParams.toString()}`);
    return response.data;
  },

  getCourseById: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post("/courses", courseData);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  getUserCourses: async () => {
    const response = await api.get("/users/me/courses");
    return response.data;
  },

  selectCourses: async (courseIds) => {
    const response = await api.post("/users/me/courses", {
      course_ids: courseIds,
    });
    return response.data;
  },

  seedCourses: async () => {
    const response = await api.post("/courses/seed");
    return response.data;
  },

  basicSearch: async (query, entityType, page = 1, perPage = 10) => {
    let url = `/search/basic?query=${query}&page=${page}&per_page=${perPage}`;
    if (entityType) {
      url += `&entity_type=${entityType}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  advancedSearch: async (searchParams) => {
    const response = await api.post("/search/advanced", searchParams);
    return response.data;
  },
};

export default courseService;
