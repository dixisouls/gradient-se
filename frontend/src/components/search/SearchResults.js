import React from "react";
import { Link } from "react-router-dom";
import Card from "../common/Card";

const SearchResults = ({ results, total, query, loading }) => {
  if (results.length === 0 && !loading) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-600">
          No results found{query ? ` for "${query}"` : ""}. Try different
          keywords or filters.
        </p>
      </Card>
    );
  }

  const getResultIcon = (type) => {
    switch (type) {
      case "course":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gradient-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
        );

      case "assignment":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gradient-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );

      case "user":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gradient-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );

      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
        );
    }
  };

  const getResultLink = (result) => {
    switch (result.type) {
      case "course":
        return `/courses/${result.id}`;
      case "assignment":
        return `/assignments/${result.id}`;
      case "user":
        return `/users/${result.id}`;
      default:
        return "#";
    }
  };

  return (
    <div>
      <p className="text-gray-600 mb-6">
        Found {total} {total === 1 ? "result" : "results"}
        {query ? ` for "${query}"` : ""}
      </p>

      <div className="space-y-4">
        {results.map((result) => (
          <Link
            key={`${result.type}-${result.id}`}
            to={getResultLink(result)}
            className="block hover:no-underline"
          >
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {getResultIcon(result.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-800 truncate">
                    {result.title}
                  </h3>

                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full capitalize">
                      {result.type}
                    </span>

                    {result.metadata?.term && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                        {result.metadata.term}
                      </span>
                    )}

                    {result.metadata?.role && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full capitalize">
                        {result.metadata.role}
                      </span>
                    )}

                    {result.metadata?.due_date && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                        Due:{" "}
                        {new Date(
                          result.metadata.due_date
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {result.description && (
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                </div>

                <div className="ml-4 flex-shrink-0">
                  <span className="inline-block rounded-full w-8 h-8 bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white text-xs flex items-center justify-center">
                    {Math.round(result.relevance * 100)}%
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
