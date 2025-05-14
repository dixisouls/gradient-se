import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Alert from "../common/Alert";
import GradientButton from "../common/GradientButton";
import Button from "../common/Button";
import Loading from "../common/Loading";
import courseService from "../../services/courseService";

const ProfessorAssignment = ({ courseId }) => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [assigningProfessor, setAssigningProfessor] = useState(false);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllProfessors();
        setProfessors(data || []);
      } catch (error) {
        console.error("Error fetching professors:", error);
        setError("Failed to load professors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  const handleProfessorChange = (e) => {
    setSelectedProfessor(e.target.value);
  };

  const handleAssignProfessor = async () => {
    if (!selectedProfessor) {
      setError("Please select a professor to assign");
      return;
    }

    try {
      setAssigningProfessor(true);
      setError(null);

      await courseService.assignProfessorToCourse(
        courseId,
        parseInt(selectedProfessor)
      );

      setSuccess("Professor successfully assigned to the course");
      setSelectedProfessor("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Error assigning professor:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to assign professor. Please try again."
      );
    } finally {
      setAssigningProfessor(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loading />
      </div>
    );
  }

  return (
    <Card title="Assign Professor to Course">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
          className="mb-4"
        />
      )}

      <div className="mb-4">
        <label htmlFor="professor" className="input-label">
          Select Professor
        </label>
        <select
          id="professor"
          value={selectedProfessor}
          onChange={handleProfessorChange}
          className="input-field"
          disabled={assigningProfessor}
        >
          <option value="">-- Select a Professor --</option>
          {professors.map((professor) => (
            <option key={professor.id} value={professor.id}>
              {professor.first_name} {professor.last_name} ({professor.email})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <GradientButton
          onClick={handleAssignProfessor}
          disabled={!selectedProfessor || assigningProfessor}
        >
          {assigningProfessor ? "Assigning..." : "Assign to Course"}
        </GradientButton>
      </div>
    </Card>
  );
};

export default ProfessorAssignment;
