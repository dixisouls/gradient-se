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
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gradient-primary bg-gradient-to-r from-gradient-primary to-gradient-secondary text-transparent bg-clip-text">
            GRADiEnt Privacy Policy
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
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
          <div className="prose max-w-none">
            <h1>GRADiEnt Privacy Policy</h1>
            <p>
              <strong>Last Updated: April 23, 2025</strong>
            </p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to GRADiEnt. We respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our AI-powered educational platform.
            </p>
            <p>
              GRADiEnt ("we," "us," or "our") provides an educational platform
              that offers AI-powered instant feedback, course registration,
              assignment submissions, and automated grading ("Services").
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>When you create an account, we collect:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Password (stored in encrypted format)</li>
              <li>Role (student, professor, or administrator)</li>
              <li>Phone number (optional)</li>
              <li>Profile information that you choose to provide</li>
            </ul>

            <h3>2.2 Educational Information</h3>
            <p>As you use GRADiEnt, we collect:</p>
            <ul>
              <li>Course enrollments and academic progress</li>
              <li>Assignments you submit, including text and uploaded files</li>
              <li>Feedback and grades</li>
              <li>Interactions with professors and the platform</li>
              <li>Course materials you access</li>
            </ul>

            <h3>2.3 Usage Information</h3>
            <p>
              We automatically collect certain information when you visit, use,
              or navigate our platform:
            </p>
            <ul>
              <li>
                Device and connection information (IP address, browser type,
                device type)
              </li>
              <li>Usage patterns and preferences</li>
              <li>Log data (pages visited, time spent)</li>
              <li>Chat conversations with our AI assistant (Neuron)</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>

            <h3>3.1 Provide and Maintain Our Services</h3>
            <ul>
              <li>Create and manage your account</li>
              <li>Process enrollments and assignment submissions</li>
              <li>Deliver AI-powered grading and feedback</li>
              <li>Facilitate communication between students and professors</li>
            </ul>

            <h3>3.2 Improve Our Services</h3>
            <ul>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Develop new features and functionalities</li>
              <li>Train and improve our AI systems</li>
              <li>Fix bugs and technical issues</li>
            </ul>

            <h3>3.3 Communications</h3>
            <ul>
              <li>
                Send administrative emails about your account or the Services
              </li>
              <li>Provide updates on courses, assignments, and deadlines</li>
              <li>Respond to your inquiries and support requests</li>
            </ul>

            <h3>3.4 Security and Legal Compliance</h3>
            <ul>
              <li>Protect against unauthorized access and fraud</li>
              <li>Comply with legal obligations</li>
              <li>Enforce our Terms of Service</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>We may share your information in the following situations:</p>

            <h3>4.1 With Other Users</h3>
            <ul>
              <li>
                Students' submitted assignments and feedback may be accessible
                to their course professors
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

            <h3>4.2 Service Providers</h3>
            <p>
              We may share information with third-party vendors, service
              providers, and contractors who perform services for us, such as:
            </p>
            <ul>
              <li>Cloud hosting providers</li>
              <li>Database management services</li>
              <li>Analytics providers</li>
              <li>Email service providers</li>
            </ul>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in
              response to valid requests by public authorities.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information, including:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage practices</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as
              necessary to fulfill the purposes outlined in this Privacy Policy,
              unless a longer retention period is required or permitted by law.
            </p>
            <p>
              For students and professors, we typically retain account
              information and educational data for the duration of your active
              use of our Services, plus a reasonable period thereafter for
              record-keeping purposes.
            </p>

            <h2>7. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information:
            </p>
            <ul>
              <li>
                <strong>Access</strong>: Request access to your personal
                information
              </li>
              <li>
                <strong>Correction</strong>: Request correction of inaccurate
                data
              </li>
              <li>
                <strong>Deletion</strong>: Request deletion of your personal
                information
              </li>
              <li>
                <strong>Portability</strong>: Request transfer of your personal
                information
              </li>
              <li>
                <strong>Restriction</strong>: Request restriction of processing
                of your data
              </li>
              <li>
                <strong>Objection</strong>: Object to processing of your
                personal information
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the details in
              the "Contact Us" section.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our Services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If we learn we have collected personal information from
              a child under 13, we will delete that information.
            </p>

            <h2>9. Third-Party Websites and Services</h2>
            <p>
              Our platform may contain links to third-party websites or services
              that are not owned or controlled by GRADiEnt. This Privacy Policy
              does not apply to those third-party websites or services. We
              recommend reviewing the privacy policies of any third-party
              websites or services you visit.
            </p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last Updated" date. For significant changes, we
              will provide a more prominent notice or direct notification.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or
              our data practices, please contact us at:
            </p>
            <p>Email: privacy@gradient.edu</p>
            <p>
              Postal Address:
              <br />
              GRADiEnt Privacy Team
              <br />
              Department of Computer Science
              <br />
              GRADiEnt University
              <br />
              [University Address]
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gradient-primary to-gradient-secondary text-white py-2 px-4 rounded-md hover:brightness-110 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
