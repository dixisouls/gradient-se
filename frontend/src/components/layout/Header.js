import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../search/SearchBar";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (query) => {
    navigate(`/search?query=${query}`);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary text-transparent bg-clip-text">
                GRADiEnt
              </span>
            </Link>

            {currentUser && (
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-gradient-primary px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/courses"
                  className="text-gray-700 hover:text-gradient-primary px-3 py-2 text-sm font-medium"
                >
                  Courses
                </Link>
              </nav>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {currentUser && (
              <>
                <div className="w-64">
                  <SearchBar onSearch={handleSearch} />
                </div>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gradient-primary">
                    <span>{currentUser.first_name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {!currentUser && (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gradient-primary hover:text-gradient-secondary px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white px-3 py-2 rounded-md text-sm font-medium hover:brightness-110"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gradient-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gradient-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/courses"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gradient-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gradient-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gradient-primary"
                >
                  Logout
                </button>
                <div className="px-3 py-2">
                  <SearchBar
                    onSearch={(query) => {
                      handleSearch(query);
                      setIsMenuOpen(false);
                    }}
                  />
                </div>
              </>
            )}

            {!currentUser && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gradient-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gradient-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
