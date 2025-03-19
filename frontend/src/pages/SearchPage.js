import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import courseService from "../services/courseService";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [entityType, setEntityType] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeSearchTerm, setActiveSearchTerm] = useState(initialQuery);
  const [isShowAll, setIsShowAll] = useState(false);

  const performSearch = async (searchQuery, type, page) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setActiveSearchTerm(searchQuery);

      const data = await courseService.basicSearch(searchQuery, type, page);

      setResults(data.results || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error("Search error:", error);
      setError("An error occurred. Please try again.");
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setCurrentPage(1);
    setIsShowAll(false);
    performSearch(searchQuery, entityType, 1);
  };

  const handleEntityTypeChange = (e) => {
    const newType = e.target.value;
    setEntityType(newType);
    setCurrentPage(1);
    if (hasSearched) {
      // If show all mode was active, maintain it with the new entity type
      if (isShowAll) {
        handleCategoryButtonClick(newType);
      } else {
        performSearch(query, newType, 1);
      }
    }
  };

  const handleFilterClick = () => {
    setIsShowAll(false);
    performSearch(query, entityType, 1);
  };

  const handleCategoryButtonClick = (type) => {
    // Set the new entity type
    setEntityType(type);
    setCurrentPage(1);
    setIsShowAll(true);

    // For "Show All Users" button, use 'a' as a common letter to match most users
    // For other categories, use a space as query to act as wildcard
    let searchTerm = " ";
    if (type === "user") {
      searchTerm = "a"; // Common letter to match most names
    }

    performSearch(searchTerm, type, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Use the active search term instead of the user's query
      // This ensures pagination works correctly for "Show All" functions
      performSearch(activeSearchTerm, entityType, newPage);
      window.scrollTo(0, 0);
    }
  };

  // Run initial search if query is in URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, entityType, 1);
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Search</h1>

        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            className="max-w-2xl"
            placeholder="Search for courses, assignments, users..."
          />

          <div className="mt-4 flex flex-wrap gap-4">
            <select
              value={entityType}
              onChange={handleEntityTypeChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gradient-primary focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="course">Courses</option>
              <option value="assignment">Assignments</option>
              <option value="user">Users</option>
            </select>

            <Button
              onClick={handleFilterClick}
              className="bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white"
            >
              Filter
            </Button>

            <div className="flex gap-2 ml-2">
              <Button
                size="sm"
                variant={entityType === "" && isShowAll ? "primary" : "outline"}
                onClick={() => handleCategoryButtonClick("")}
              >
                Show All
              </Button>
              <Button
                size="sm"
                variant={
                  entityType === "assignment" && isShowAll
                    ? "primary"
                    : "outline"
                }
                onClick={() => handleCategoryButtonClick("assignment")}
              >
                Show All Assignments
              </Button>
              <Button
                size="sm"
                variant={
                  entityType === "user" && isShowAll ? "primary" : "outline"
                }
                onClick={() => handleCategoryButtonClick("user")}
              >
                Show All Users
              </Button>
            </div>
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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" />
          </div>
        ) : hasSearched ? (
          <div>
            <SearchResults
              results={results}
              total={total}
              query={isShowAll ? "" : query}
              loading={loading}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-l-md text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="px-4 py-2 border-t border-b border-gray-300 bg-white">
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-r-md text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Enter a search term to find courses, assignments, and users, or
              select a category to see all items.
            </p>
            <p className="text-gray-500">
              Examples: "computer science", "essay", "calculus"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
