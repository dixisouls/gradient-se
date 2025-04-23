import React, { useState } from "react";
import { Link } from "react-router-dom";
import TermsModal from "../modals/TermsModal";
import PrivacyModal from "../modals/PrivacyModal";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-gradient-primary via-gradient-secondary to-gradient-tertiary text-transparent bg-clip-text">
              GRADiEnt
            </h3>
            <p className="text-gray-300 mb-4">
              Empowering education through instant AI-powered feedback and
              insights.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-gray-300 hover:text-white bg-transparent border-none p-0 cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-gray-300 hover:text-white bg-transparent border-none p-0 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <p className="text-gray-300 mb-2">GRADiEnt University</p>
            <p className="text-gray-300 mb-2">Department of Computer Science</p>
            <p className="text-gray-300">Email: info@gradient.edu</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {currentYear} GRADiEnt. All rights reserved.</p>
        </div>
      </div>

      {/* Terms of Service Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </footer>
  );
};

export default Footer;
