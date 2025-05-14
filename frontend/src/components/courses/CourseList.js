import React, { useState, useEffect } from "react";
import courseService from "../../services/courseService";
import CourseCard from "./CourseCard";
import Loading from "../common/Loading";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";
import { useAuth } from "../../context/AuthContext";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTerm, setCurrentTerm] = useState("");
  const [terms, setTerms] = useState([]);
  const [shouldRefetchTerms, setShouldRefetchTerms] = useState(true);

  const { currentUser } = useAuth();
  const isProfessor = currentUser && currentUser.role === "professor";

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (currentTerm) {
          params.term = currentTerm;
        }

        const data = await courseService.getAllCourses(params);
        setCourses(data.courses);
        setTotalCourses(data.total);

        // Only fetch all terms when needed (initial load or after seeding)
        if (shouldRefetchTerms) {
          // Always fetch all courses to get all terms
          const allCoursesData = await courseService.getAllCourses({});
          const uniqueTerms = [
            ...new Set(allCoursesData.courses.map((course) => course.term)),
          ];
          // Sort terms
          uniqueTerms.sort();
          setTerms(uniqueTerms);
          setShouldRefetchTerms(false);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentTerm, shouldRefetchTerms]);

  const handleTermChange = (e) => {
    setCurrentTerm(e.target.value);
  };

  const handleSeedCourses = async () => {
    try {
      setLoading(true);
      const result = await courseService.seedCourses();
      alert(result.message); // Simple alert to inform the user

      // Set flag to refetch terms
      setShouldRefetchTerms(true);
    } catch (error) {
      console.error("Error seeding courses:", error);
      setError("Failed to seed courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">
            Courses
          </h2>
          <p className="text-gray-600">
            {totalCourses} {totalCourses === 1 ? "course" : "courses"} available
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {terms.length > 0 && (
            <div className="w-full sm:w-auto">
              <select
                value={currentTerm}
                onChange={handleTermChange}
                className="input-field w-full"
              >
                <option value="">All Terms</option>
                {terms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isProfessor && (
            <div className="w-full sm:w-auto">
              <GradientButton
                onClick={handleSeedCourses}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Seed Courses
              </GradientButton>
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <p className="text-gray-600 mb-4">
            No courses available for the selected term.
          </p>
          {isProfessor && (
            <GradientButton onClick={handleSeedCourses}>
              Add Sample Courses
            </GradientButton>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
