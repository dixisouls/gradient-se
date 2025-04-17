import React from "react";
import { Link } from "react-router-dom";
import Card from "../common/Card";

const CourseCard = ({ course }) => {
  const { id, code, name, description, term } = course;

  // Truncate description if it's too long
  const truncatedDescription =
    description && description.length > 150
      ? `${description.substring(0, 150)}...`
      : description;

  return (
    <Link to={`/courses/${id}`} className="block hover:no-underline">
      <Card
        gradientBorder
        className="h-full transition-transform hover:transform hover:scale-105"
      >
        <div className="mb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mr-3 mb-1 sm:mb-0 break-words">
              {name}
            </h3>
            <span className="inline-flex px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-gradient-primary to-gradient-secondary rounded-full whitespace-nowrap mb-1 sm:mb-0 self-start">
              {term}
            </span>
          </div>
          <span className="text-sm text-gray-500 block">{code}</span>
        </div>

        {truncatedDescription && (
          <p className="text-gray-600 text-sm mb-3">{truncatedDescription}</p>
        )}

        <div className="mt-auto">
          <button className="text-gradient-primary hover:text-gradient-secondary font-medium">
            View Course
          </button>
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard;
