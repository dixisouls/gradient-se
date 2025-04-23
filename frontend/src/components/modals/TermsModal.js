import React, { useEffect, useRef } from "react";

const TermsModal = ({ isOpen, onClose }) => {
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
            GRADiEnt Terms of Service
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
            <h1>GRADiEnt Terms of Service</h1>
            <p>
              <strong>Last Updated: April 23, 2025</strong>
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using GRADiEnt ("the Platform"), you agree to be
              bound by these Terms of Service ("Terms"). If you do not agree to
              these Terms, you may not access or use the Platform.
            </p>
            <p>
              GRADiEnt provides an educational platform that offers AI-powered
              instant feedback, course registration, assignment submissions, and
              automated grading ("Services").
            </p>

            <h2>2. Registration and Account</h2>
            <h3>2.1 Account Creation</h3>
            <p>
              To use most features of our Platform, you must register for an
              account. When you register, you agree to provide accurate,
              current, and complete information about yourself and to update
              this information to maintain its accuracy.
            </p>

            <h3>2.2 Account Security</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your password</li>
              <li>Restricting access to your account</li>
              <li>All activities that occur under your account</li>
            </ul>
            <p>
              You agree to notify us immediately of any unauthorized access to
              or use of your account.
            </p>

            <h3>2.3 Account Types</h3>
            <p>The Platform offers different account types:</p>
            <ul>
              <li>
                <strong>Student accounts</strong>: For individuals enrolled in
                courses
              </li>
              <li>
                <strong>Professor accounts</strong>: For educators teaching
                courses
              </li>
              <li>
                <strong>Administrator accounts</strong>: For platform
                administrators
              </li>
            </ul>
            <p>
              Each account type has different permissions and responsibilities
              as described in our documentation.
            </p>

            <h2>3. User Conduct</h2>
            <p>
              You agree to use the Platform in accordance with all applicable
              laws and regulations. You agree not to:
            </p>
            <ul>
              <li>Use the Platform for any illegal purpose</li>
              <li>Violate any intellectual property rights</li>
              <li>Upload viruses or malicious code</li>
              <li>
                Attempt to gain unauthorized access to the Platform or other
                users' accounts
              </li>
              <li>Impersonate another person or entity</li>
              <li>Interfere with the proper working of the Platform</li>
              <li>Engage in academic dishonesty, including plagiarism</li>
              <li>
                Submit content that is unlawful, offensive, threatening,
                defamatory, or otherwise objectionable
              </li>
              <li>
                Sell, resell, or commercially use the Platform without
                authorization
              </li>
              <li>
                Attempt to decompile, reverse engineer, or disassemble any
                software contained on the Platform
              </li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <h3>4.1 GRADiEnt Intellectual Property</h3>
            <p>
              The Platform and its original content, features, and functionality
              are owned by GRADiEnt and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>

            <h3>4.2 User Content</h3>
            <p>
              You retain all rights to content you submit, post, or display on
              or through the Platform ("User Content"). By providing User
              Content, you grant us a worldwide, non-exclusive, royalty-free
              license to use, reproduce, modify, adapt, publish, translate, and
              distribute such content in connection with providing and improving
              our Services.
            </p>

            <h3>4.3 Educational Materials</h3>
            <p>
              Course materials provided by professors are subject to copyright
              protection. Students may use these materials for educational
              purposes but may not distribute, sell, or publish them without
              permission.
            </p>

            <h2>5. AI-Powered Services</h2>
            <h3>5.1 Automated Grading and Feedback</h3>
            <p>
              Our Platform uses artificial intelligence to provide automated
              grading and feedback on assignments. While we strive for accuracy,
              the AI-generated feedback:
            </p>
            <ul>
              <li>Is not a substitute for professor evaluation</li>
              <li>May require human review</li>
              <li>
                Should be considered as a learning tool, not definitive
                assessment
              </li>
            </ul>

            <h3>5.2 AI Assistant (Neuron)</h3>
            <p>
              Our AI assistant, Neuron, provides educational support.
              Conversations with Neuron:
            </p>
            <ul>
              <li>Are stored and analyzed to improve our Services</li>
              <li>Should not be considered as authoritative academic advice</li>
              <li>May not always provide complete or accurate information</li>
            </ul>

            <h2>6. Submissions and Assignments</h2>
            <h3>6.1 Submissions</h3>
            <p>When you submit assignments through the Platform:</p>
            <ul>
              <li>You certify that the submission is your original work</li>
              <li>
                You understand that professors and authorized administrators may
                access your submissions
              </li>
              <li>
                You grant us the right to process your submission using our AI
                systems for grading and feedback
              </li>
            </ul>

            <h3>6.2 Late Submissions</h3>
            <p>
              The Platform may track submission deadlines. It is your
              responsibility to:
            </p>
            <ul>
              <li>Be aware of assignment due dates</li>
              <li>Submit assignments before deadlines</li>
              <li>Check if your professor allows late submissions</li>
            </ul>

            <h3>6.3 Resubmissions</h3>
            <p>
              Resubmission policies are set by individual professors. The
              Platform will enforce these policies as configured.
            </p>

            <h2>7. Privacy and Data</h2>
            <p>
              Your use of the Platform is also governed by our Privacy Policy,
              which is incorporated into these Terms by reference. Please review
              our Privacy Policy to understand our practices regarding your
              personal data.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, GRADiEnt and its
              affiliates, officers, employees, agents, partners, and licensors
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including without limitation,
              loss of profits, data, use, goodwill, or other intangible losses,
              resulting from:
            </p>
            <ul>
              <li>
                Your access to or use of or inability to access or use the
                Platform
              </li>
              <li>Any conduct or content of any third party on the Platform</li>
              <li>
                Unauthorized access, use, or alteration of your transmissions or
                content
              </li>
              <li>The accuracy of AI-generated feedback or grading</li>
              <li>System outages or data loss</li>
            </ul>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              The Platform is provided on an "AS IS" and "AS AVAILABLE" basis.
              GRADiEnt expressly disclaims all warranties of any kind, whether
              express or implied, including but not limited to the implied
              warranties of merchantability, fitness for a particular purpose,
              and non-infringement.
            </p>
            <p>We do not warrant that:</p>
            <ul>
              <li>
                The Platform will function uninterrupted, secure, or available
                at any particular time or location
              </li>
              <li>Any errors or defects will be corrected</li>
              <li>
                The Platform is free of viruses or other harmful components
              </li>
              <li>
                The AI-generated feedback will be 100% accurate or complete
              </li>
            </ul>

            <h2>10. Termination</h2>
            <h3>10.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by contacting us or
              using the account deletion feature if available.
            </p>

            <h3>10.2 Termination by GRADiEnt</h3>
            <p>
              We may suspend or terminate your account and access to the
              Platform:
            </p>
            <ul>
              <li>For violations of these Terms</li>
              <li>At the request of your educational institution</li>
              <li>For extended periods of inactivity</li>
              <li>
                If we believe your use poses a risk to GRADiEnt or other users
              </li>
              <li>At our sole discretion for any reason</li>
            </ul>

            <h3>10.3 Effects of Termination</h3>
            <p>Upon termination:</p>
            <ul>
              <li>Your access rights to the Platform will cease</li>
              <li>
                Your submitted content may remain on the Platform per our data
                retention policies
              </li>
              <li>
                Provisions of the Terms which by their nature should survive
                will remain in effect
              </li>
            </ul>

            <h2>11. Modifications to Terms</h2>
            <p>
              We may modify these Terms at any time. If we make material
              changes, we will notify you through the Platform or by email. Your
              continued use of the Platform after such notification constitutes
              acceptance of the modified Terms.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of [Jurisdiction], without regard to its conflict of law
              provisions.
            </p>

            <h2>13. Dispute Resolution</h2>
            <p>
              Any dispute arising from or relating to these Terms or your use of
              the Platform shall be resolved through:
            </p>
            <ol>
              <li>
                Informal negotiation - Contact us first to try to resolve the
                dispute
              </li>
              <li>
                Mediation - If negotiation fails, by a mutually agreed upon
                mediator
              </li>
              <li>
                Arbitration - If mediation fails, through binding arbitration in
                [Jurisdiction]
              </li>
            </ol>

            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is held to be unenforceable or
              invalid, such provision will be changed and interpreted to
              accomplish the objectives of such provision to the greatest extent
              possible under applicable law, and the remaining provisions will
              continue in full force and effect.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>Email: legal@gradient.edu</p>
            <p>
              Postal Address:
              <br />
              GRADiEnt Legal Department
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

export default TermsModal;
