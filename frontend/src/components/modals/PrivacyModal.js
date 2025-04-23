import React, { useEffect, useRef } from "react";

const PrivacyModal = ({ isOpen, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    // Function to handle clicking outside the modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Function to handle ESC key press
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listeners if modal is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-gradient-primary/10 to-gradient-secondary/10 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gradient-primary bg-gradient-to-r from-gradient-primary to-gradient-secondary text-transparent bg-clip-text">
            GRADiEnt Privacy Policy
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-gradient-primary to-gradient-secondary text-transparent bg-clip-text">
              GRADiEnt Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              <strong>Last Updated: April 23, 2025</strong>
            </p>

            {/* Section 1 */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-gradient-primary">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to GRADiEnt. We respect your privacy and are committed
                to protecting your personal data. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information
                when you use our AI-powered educational platform.
              </p>
              <p className="text-gray-700">
                GRADiEnt ("we," "us," or "our") provides an educational platform
                that offers AI-powered instant feedback, course registration,
                assignment submissions, and automated grading ("Services").
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                2. Information We Collect
              </h2>

              <div className="ml-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.1 Personal Information
                </h3>
                <p className="text-gray-700 mb-3">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Password (stored in encrypted format)</li>
                  <li>Role (student, professor, or administrator)</li>
                  <li>Phone number (optional)</li>
                  <li>Profile information that you choose to provide</li>
                </ul>
              </div>

              <div className="ml-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.2 Educational Information
                </h3>
                <p className="text-gray-700 mb-3">
                  As you use GRADiEnt, we collect:
                </p>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Course enrollments and academic progress</li>
                  <li>
                    Assignments you submit, including text and uploaded files
                  </li>
                  <li>Feedback and grades</li>
                  <li>Interactions with professors and the platform</li>
                  <li>Course materials you access</li>
                </ul>
              </div>

              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.3 Usage Information
                </h3>
                <p className="text-gray-700 mb-3">
                  We automatically collect certain information when you visit,
                  use, or navigate our platform:
                </p>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>
                    Device and connection information (IP address, browser type,
                    device type)
                  </li>
                  <li>Usage patterns and preferences</li>
                  <li>Log data (pages visited, time spent)</li>
                  <li>Chat conversations with our AI assistant (Neuron)</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-8 p-6 bg-purple-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use your information for the following purposes:
              </p>

              <div className="ml-2 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.1 Provide and Maintain Our Services
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Create and manage your account</li>
                  <li>Process enrollments and assignment submissions</li>
                  <li>Deliver AI-powered grading and feedback</li>
                  <li>
                    Facilitate communication between students and professors
                  </li>
                </ul>
              </div>

              <div className="ml-2 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.2 Improve Our Services
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Develop new features and functionalities</li>
                  <li>Train and improve our AI systems</li>
                  <li>Fix bugs and technical issues</li>
                </ul>
              </div>

              <div className="ml-2 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.3 Communications
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>
                    Send administrative emails about your account or the
                    Services
                  </li>
                  <li>
                    Provide updates on courses, assignments, and deadlines
                  </li>
                  <li>Respond to your inquiries and support requests</li>
                </ul>
              </div>

              <div className="ml-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.4 Security and Legal Compliance
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Protect against unauthorized access and fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Enforce our Terms of Service</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                4. How We Share Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We may share your information in the following situations:
              </p>

              <div className="ml-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.1 With Other Users
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>
                    Students' submitted assignments and feedback may be
                    accessible to their course professors
                  </li>
                  <li>
                    Professors' course information may be visible to enrolled
                    students
                  </li>
                  <li>
                    Names and basic profile information may be visible to other
                    users
                  </li>
                </ul>
              </div>

              <div className="ml-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.2 Service Providers
                </h3>
                <p className="text-gray-700 mb-3">
                  We may share information with third-party vendors, service
                  providers, and contractors who perform services for us, such
                  as:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Cloud hosting providers</li>
                  <li>Database management services</li>
                  <li>Analytics providers</li>
                  <li>Email service providers</li>
                </ul>
              </div>

              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.3 Legal Requirements
                </h3>
                <p className="text-gray-700">
                  We may disclose your information if required to do so by law
                  or in response to valid requests by public authorities.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-gradient-secondary">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information, including:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage practices</li>
              </ul>
              <p className="text-gray-700 mt-4">
                However, no method of transmission over the Internet or
                electronic storage is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We will retain your personal information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required or
                permitted by law.
              </p>
              <p className="text-gray-700 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                For students and professors, we typically retain account
                information and educational data for the duration of your active
                use of our Services, plus a reasonable period thereafter for
                record-keeping purposes.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-8 p-6 bg-green-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="font-semibold text-gray-800 mb-1">Access</p>
                  <p className="text-gray-700 text-sm">
                    Request access to your personal information
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="font-semibold text-gray-800 mb-1">Correction</p>
                  <p className="text-gray-700 text-sm">
                    Request correction of inaccurate data
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="font-semibold text-gray-800 mb-1">Deletion</p>
                  <p className="text-gray-700 text-sm">
                    Request deletion of your personal information
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="font-semibold text-gray-800 mb-1">
                    Portability
                  </p>
                  <p className="text-gray-700 text-sm">
                    Request transfer of your personal information
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="font-semibold text-gray-800 mb-1">
                    Restriction
                  </p>
                  <p className="text-gray-700 text-sm">
                    Request restriction of processing of your data
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="font-semibold text-gray-800 mb-1">Objection</p>
                  <p className="text-gray-700 text-sm">
                    Object to processing of your personal information
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us using the details in
                the "Contact Us" section.
              </p>
            </div>

            {/* Section 8-11 */}
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  8. Children's Privacy
                </h2>
                <p className="text-gray-700 p-4 bg-yellow-50 rounded-lg">
                  Our Services are not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If we learn we have collected personal
                  information from a child under 13, we will delete that
                  information.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  9. Third-Party Websites and Services
                </h2>
                <p className="text-gray-700">
                  Our platform may contain links to third-party websites or
                  services that are not owned or controlled by GRADiEnt. This
                  Privacy Policy does not apply to those third-party websites or
                  services. We recommend reviewing the privacy policies of any
                  third-party websites or services you visit.
                </p>
              </div>

              <div className="mb-8 p-6 bg-purple-50 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-700">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last Updated" date. For
                  significant changes, we will provide a more prominent notice
                  or direct notification.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  11. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions or concerns about this Privacy
                  Policy or our data practices, please contact us at:
                </p>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="mb-2">
                    <span className="font-semibold">Email:</span>{" "}
                    <a
                      href="mailto:privacy@gradient.edu"
                      className="text-gradient-primary hover:underline"
                    >
                      privacy@gradient.edu
                    </a>
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Postal Address:</span>
                  </p>
                  <address className="ml-4 not-italic">
                    GRADiEnt Privacy Team
                    <br />
                    Department of Computer Science
                    <br />
                    GRADiEnt University
                  </address>
                </div>
              </div>
            </div>

            {/* Data Protection Statement */}
            <div className="p-6 bg-gradient-to-r from-gradient-primary/5 to-gradient-secondary/5 rounded-lg mt-8 border border-gradient-primary/20">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-gradient-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Our Commitment to Data Protection
              </h2>
              <p className="text-gray-700">
                At GRADiEnt, we are committed to protecting your personal data
                and respecting your privacy. We continuously review and improve
                our security practices and data handling procedures to ensure we
                maintain the highest standards of data protection. Our team
                regularly undergoes training on privacy matters to stay updated
                on best practices and regulations concerning personal data.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white flex justify-between items-center">
          <p className="text-sm text-gray-500">Last updated: April 23, 2025</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white py-2 px-6 rounded-md hover:brightness-110 transition-all font-medium"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
