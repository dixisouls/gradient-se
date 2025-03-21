import bcrypt
import psycopg2
import re
import os
from datetime import datetime, timedelta

# Function to hash password with bcrypt
def hash_password(password):
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

# Database connection parameters - replace with your actual credentials
DB_PARAMS = {
    "dbname": "gradient",
    "user": "postgres",  # Replace with your PostgreSQL username
    "password": "Admin",  # Replace with your PostgreSQL password
    "host": "localhost",
    "port": "5432"
}

# User data with plain passwords
users_with_passwords = [
    # Format: email, password, first_name, last_name, role, phone_number
    ('smith.john@university.edu', 'professor123', 'John', 'Smith', 'professor', '555-123-4567'),
    ('garcia.elena@university.edu', 'professor123', 'Elena', 'Garcia', 'professor', '555-234-5678'),
    ('patel.raj@university.edu', 'professor123', 'Raj', 'Patel', 'professor', '555-345-6789'),
    ('jones.sarah@university.edu', 'student123', 'Sarah', 'Jones', 'student', '555-456-7890'),
    ('zhang.wei@university.edu', 'student123', 'Wei', 'Zhang', 'student', '555-567-8901'),
    ('rodriguez.miguel@university.edu', 'student123', 'Miguel', 'Rodriguez', 'student', '555-678-9012'),
    ('williams.alex@university.edu', 'student123', 'Alex', 'Williams', 'student', '555-789-0123'),
    ('nguyen.kim@university.edu', 'student123', 'Kim', 'Nguyen', 'student', '555-890-1234'),
    ('johnson.mike@university.edu', 'student123', 'Mike', 'Johnson', 'student', '555-901-2345'),
    ('admin@university.edu', 'admin123', 'Admin', 'User', 'admin', '555-000-0000')
]

# Course data
courses_data = [
    # Format: code, name, description, term
    ('CS101', 'Introduction to Computer Science', 'Fundamental concepts of programming and computer science.', 'Spring 2025'),
    ('ENG201', 'Advanced Composition', 'Advanced techniques for academic and professional writing.', 'Spring 2025'),
    ('MATH303', 'Linear Algebra', 'Vector spaces, linear transformations, matrices, and applications.', 'Spring 2025'),
    ('CS305', 'Database Systems', 'Design and implementation of database management systems.', 'Spring 2025'),
    ('BIO240', 'Genetics', 'Principles of inheritance and gene expression in organisms.', 'Spring 2025')
]

# Course user relationships
course_users_data = [
    # Format: course_index, user_index, role
    # CS101 - Prof. Smith & Students
    (1, 1, 'professor'),
    (1, 4, 'student'),
    (1, 5, 'student'),
    (1, 6, 'student'),
    # ENG201 - Prof. Garcia & Students
    (2, 2, 'professor'),
    (2, 7, 'student'),
    (2, 8, 'student'),
    # MATH303 - Prof. Patel & Students
    (3, 3, 'professor'),
    (3, 4, 'student'),
    (3, 9, 'student'),
    # CS305 - Prof. Smith & Students
    (4, 1, 'professor'),
    (4, 5, 'student'),
    (4, 6, 'student'),
    (4, 7, 'student'),
    # BIO240 - Prof. Garcia & Students
    (5, 2, 'professor'),
    (5, 8, 'student'),
    (5, 9, 'student')
]

def setup_database():
    """Set up the gradient database with all sample data and known passwords"""
    conn = None
    try:
        # Connect to the database
        print("Connecting to the database...")
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        
        # Insert Users
        print("Inserting users with known passwords...")
        user_ids = {}  # Store the generated user IDs
        for i, (email, password, first_name, last_name, role, phone_number) in enumerate(users_with_passwords, 1):
            password_hash = hash_password(password)
            cursor.execute(
                """
                INSERT INTO users (email, password_hash, first_name, last_name, role, phone_number)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (email, password_hash, first_name, last_name, role, phone_number)
            )
            user_id = cursor.fetchone()[0]
            user_ids[i] = user_id
            print(f"Added user: {email} with password: {password}")
        
        # Insert Courses
        print("\nInserting courses...")
        course_ids = {}  # Store the generated course IDs
        for i, (code, name, description, term) in enumerate(courses_data, 1):
            cursor.execute(
                """
                INSERT INTO courses (code, name, description, term)
                VALUES (%s, %s, %s, %s)
                RETURNING id
                """,
                (code, name, description, term)
            )
            course_id = cursor.fetchone()[0]
            course_ids[i] = course_id
            print(f"Added course: {code} - {name}")
        
        # Insert Course Users
        print("\nAssigning users to courses...")
        for course_index, user_index, role in course_users_data:
            course_id = course_ids[course_index]
            user_id = user_ids[user_index]
            cursor.execute(
                """
                INSERT INTO course_users (course_id, user_id, role)
                VALUES (%s, %s, %s)
                """,
                (course_id, user_id, role)
            )
            print(f"Assigned user #{user_index} to course #{course_index} as {role}")
        
        # Insert Assignments
        print("\nCreating assignments...")
        assignments = [
            # Format: course_index, title, description, assignment_type, days_until_due, points, allow_resubmissions, resubmission_days, created_by_user_index
            (1, 'Python Basics', 'Write a program that calculates the factorial of a number.', 'code', 7, 50, True, 10, 1),
            (1, 'Algorithm Analysis', 'Analyze the time complexity of common sorting algorithms.', 'essay', 14, 50, False, None, 1),
            (2, 'Research Paper', 'Write a 10-page research paper on a topic of your choice.', 'essay', 21, 100, True, 28, 2),
            (2, 'Literary Analysis Presentation', 'Create a presentation analyzing a work of literature.', 'presentation', 10, 75, False, None, 2),
            (3, 'Matrix Operations', 'Solve problems involving matrix operations and transformations.', 'quiz', 5, 30, False, None, 3),
            (4, 'ER Diagram Design', 'Create an ER diagram for a university database system.', 'other', 12, 50, True, 15, 1),
            (5, 'Genetics Lab Report', 'Write a report on the genetic experiment conducted in lab.', 'essay', 9, 60, False, None, 2)
        ]
        
        assignment_ids = {}  # Store the generated assignment IDs
        now = datetime.now()
        
        for i, (course_index, title, description, assignment_type, days_until_due, points, allow_resubmissions, resubmission_days, created_by_user_index) in enumerate(assignments, 1):
            course_id = course_ids[course_index]
            created_by = user_ids[created_by_user_index]
            due_date = now + timedelta(days=days_until_due)
            resubmission_deadline = now + timedelta(days=resubmission_days) if resubmission_days else None
            
            cursor.execute(
                """
                INSERT INTO assignments (course_id, title, description, assignment_type, due_date, points_possible, 
                                         allow_resubmissions, resubmission_deadline, created_by)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (course_id, title, description, assignment_type, due_date, points, 
                 allow_resubmissions, resubmission_deadline, created_by)
            )
            assignment_id = cursor.fetchone()[0]
            assignment_ids[i] = assignment_id
            print(f"Created assignment: {title} for course #{course_index}")
        
        # Insert Assignment Materials
        print("\nAdding assignment materials...")
        materials = [
            # Format: assignment_index, file_name, file_path, file_type, content_type, uploaded_by_user_index
            (1, 'python_basics_solution.py', '/materials/assignments/1/solutions/python_basics_solution.py', 'py', 'reference_solution', 1),
            (1, 'python_basics_rubric.pdf', '/materials/assignments/1/rubrics/python_basics_rubric.pdf', 'pdf', 'rubric', 1),
            (2, 'algorithm_analysis_rubric.pdf', '/materials/assignments/2/rubrics/algorithm_analysis_rubric.pdf', 'pdf', 'rubric', 1),
            (3, 'research_paper_guidelines.pdf', '/materials/assignments/3/supplementary/research_paper_guidelines.pdf', 'pdf', 'supplementary_material', 2),
            (3, 'research_paper_rubric.pdf', '/materials/assignments/3/rubrics/research_paper_rubric.pdf', 'pdf', 'rubric', 2),
            (5, 'matrix_operations_solution.pdf', '/materials/assignments/5/solutions/matrix_operations_solution.pdf', 'pdf', 'reference_solution', 3)
        ]
        
        for assignment_index, file_name, file_path, file_type, content_type, uploaded_by_user_index in materials:
            assignment_id = assignment_ids[assignment_index]
            uploaded_by = user_ids[uploaded_by_user_index]
            
            cursor.execute(
                """
                INSERT INTO assignment_materials (assignment_id, file_name, file_path, file_type, content_type, uploaded_by)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (assignment_id, file_name, file_path, file_type, content_type, uploaded_by)
            )
            print(f"Added material: {file_name} for assignment #{assignment_index}")
        
        # Insert Submissions
        print("\nAdding student submissions...")
        submissions = [
            # Format: assignment_index, user_index, days_ago, file_name, file_path, file_type, submission_text, attempt_number
            (1, 4, 2, 'factorial.py', '/submissions/1/4/factorial.py', 'py', 'def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)', 1),
            (1, 5, 3, 'factorial.py', '/submissions/1/5/factorial.py', 'py', 'def factorial(n):\n    result = 1\n    for i in range(1, n+1):\n        result *= i\n    return result', 1),
            (3, 7, 5, 'research_paper.docx', '/submissions/3/7/research_paper.docx', 'docx', None, 1),
            (5, 4, 1, None, None, None, 'Matrix A = [[1,2],[3,4]]\nMatrix B = [[5,6],[7,8]]\nA + B = [[6,8],[10,12]]', 1),
            (6, 5, 4, 'university_er_diagram.pdf', '/submissions/6/5/university_er_diagram.pdf', 'pdf', None, 1)
        ]
        
        submission_ids = {}  # Store the generated submission IDs
        for i, (assignment_index, user_index, days_ago, file_name, file_path, file_type, submission_text, attempt_number) in enumerate(submissions, 1):
            assignment_id = assignment_ids[assignment_index]
            user_id = user_ids[user_index]
            submission_time = now - timedelta(days=days_ago)
            
            cursor.execute(
                """
                INSERT INTO submissions (assignment_id, user_id, submission_time, file_name, file_path, file_type, submission_text, attempt_number)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (assignment_id, user_id, submission_time, file_name, file_path, file_type, submission_text, attempt_number)
            )
            submission_id = cursor.fetchone()[0]
            submission_ids[i] = submission_id
            print(f"Added submission from user #{user_index} for assignment #{assignment_index}")
        
        # Insert Feedback
        print("\nAdding feedback...")
        feedback_data = [
            # Format: submission_index, feedback_text, grammar_score, readability_score, structure_score, logic_score, similarity_score, suggested_grade, final_grade, graded_by, professor_review, professor_comments
            (1, 'Good implementation of the recursive factorial function. The code is concise and correct.', None, None, None, 95.00, 90.00, 45.00, 45.00, 'GRADiEnt AI', True, 'Nice work on implementing the recursive solution!'),
            (2, 'Good implementation of the iterative factorial function. The code is efficient and correct.', None, None, None, 95.00, 90.00, 45.00, 47.00, 'GRADiEnt AI', True, 'Excellent use of the iterative approach for better memory efficiency.'),
            (3, 'The research paper has a strong thesis and good supporting evidence. Some improvements needed in the conclusion.', 88.50, 85.00, 82.00, None, 78.00, 76.00, 78.00, 'GRADiEnt AI', True, 'Good work, but please strengthen your conclusion in your next draft.'),
            (4, 'The matrix addition is correctly calculated, but you should show your work more clearly.', None, 75.00, 70.00, 90.00, 85.00, 25.50, 24.00, 'GRADiEnt AI', True, 'Make sure to show the step-by-step process in your solutions.')
        ]
        
        feedback_ids = {}  # Store the generated feedback IDs
        for i, (submission_index, feedback_text, grammar_score, readability_score, structure_score, logic_score, similarity_score, suggested_grade, final_grade, graded_by, professor_review, professor_comments) in enumerate(feedback_data, 1):
            submission_id = submission_ids[submission_index]
            
            cursor.execute(
                """
                INSERT INTO feedback (submission_id, feedback_text, grammar_score, readability_score, structure_score, logic_score, 
                                     similarity_score, suggested_grade, final_grade, graded_by, professor_review, professor_comments)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (submission_id, feedback_text, grammar_score, readability_score, structure_score, logic_score, 
                 similarity_score, suggested_grade, final_grade, graded_by, professor_review, professor_comments)
            )
            feedback_id = cursor.fetchone()[0]
            feedback_ids[i] = feedback_id
            print(f"Added feedback for submission #{submission_index}")
        
        # Insert Feedback Details
        print("\nAdding feedback details...")
        feedback_details = [
            # Format: feedback_index, issue_type, issue_location, issue_description, suggestion, severity
            (1, 'logic', 'Line 2-5', 'Recursive solution without base case handling could cause stack overflow for large inputs.', 'Consider adding input validation for negative numbers.', 'low'),
            (2, 'logic', 'Line 2', 'The loop range could be more efficient.', 'For very large numbers, consider using a more optimized algorithm.', 'low'),
            (3, 'grammar', 'Page 3, Paragraph 2', 'Multiple comma splices found in this paragraph.', 'Use semicolons or separate sentences for independent clauses.', 'medium'),
            (3, 'structure', 'Conclusion', 'The conclusion does not effectively summarize the main points.', 'Revise the conclusion to reflect all major arguments made in the paper.', 'medium'),
            (4, 'structure', 'Solution Format', 'The solution lacks clear steps and explanation.', 'Show each step of the matrix addition with proper notation.', 'medium')
        ]
        
        for feedback_index, issue_type, issue_location, issue_description, suggestion, severity in feedback_details:
            feedback_id = feedback_ids[feedback_index]
            
            cursor.execute(
                """
                INSERT INTO feedback_details (feedback_id, issue_type, issue_location, issue_description, suggestion, severity)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (feedback_id, issue_type, issue_location, issue_description, suggestion, severity)
            )
            print(f"Added feedback detail for feedback #{feedback_index}")
        
        # Insert Rubrics
        print("\nCreating rubrics...")
        rubrics_data = [
            # Format: assignment_index, title, description, created_by_user_index
            (1, 'Python Basics Rubric', 'Evaluation criteria for the Python factorial assignment.', 1),
            (2, 'Algorithm Analysis Rubric', 'Criteria for evaluating algorithm analysis essays.', 1),
            (3, 'Research Paper Rubric', 'Detailed criteria for evaluating research papers.', 2),
            (5, 'Matrix Operations Rubric', 'Criteria for evaluating matrix operation solutions.', 3)
        ]
        
        rubric_ids = {}  # Store the generated rubric IDs
        for i, (assignment_index, title, description, created_by_user_index) in enumerate(rubrics_data, 1):
            assignment_id = assignment_ids[assignment_index]
            created_by = user_ids[created_by_user_index]
            
            cursor.execute(
                """
                INSERT INTO rubrics (assignment_id, title, description, created_by)
                VALUES (%s, %s, %s, %s)
                RETURNING id
                """,
                (assignment_id, title, description, created_by)
            )
            rubric_id = cursor.fetchone()[0]
            rubric_ids[i] = rubric_id
            print(f"Created rubric: {title} for assignment #{assignment_index}")
        
        # Insert Rubric Criteria
        print("\nAdding rubric criteria...")
        rubric_criteria = [
            # Format: rubric_index, criteria_name, description, points_possible, weight
            # Python Basics Rubric Criteria
            (1, 'Correctness', 'Program produces correct outputs for all test cases.', 25.00, 0.50),
            (1, 'Code Quality', 'Code is well-structured, readable, and follows best practices.', 15.00, 0.30),
            (1, 'Documentation', 'Code includes appropriate comments and documentation.', 10.00, 0.20),
            # Research Paper Rubric Criteria
            (3, 'Thesis Development', 'Clear thesis statement that is well-developed throughout the paper.', 25.00, 0.25),
            (3, 'Evidence & Support', 'Strong evidence from credible sources that supports the thesis.', 25.00, 0.25),
            (3, 'Organization', 'Logical organization with effective transitions.', 20.00, 0.20),
            (3, 'Grammar & Mechanics', 'Correct grammar, spelling, and punctuation.', 15.00, 0.15),
            (3, 'Citation & Formatting', 'Proper citations and formatting according to the required style.', 15.00, 0.15)
        ]
        
        for rubric_index, criteria_name, description, points_possible, weight in rubric_criteria:
            rubric_id = rubric_ids[rubric_index]
            
            cursor.execute(
                """
                INSERT INTO rubric_criteria (rubric_id, criteria_name, description, points_possible, weight)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (rubric_id, criteria_name, description, points_possible, weight)
            )
            print(f"Added criteria: {criteria_name} to rubric #{rubric_index}")
        
        # Insert Notifications
        print("\nCreating notifications...")
        notifications = [
            # Format: user_index, title, message, notification_type, related_assignment_index, is_read, days_ago
            (4, 'Assignment Due Soon', 'Your Python Basics assignment is due in 2 days.', 'deadline_reminder', 1, False, 2),
            (5, 'Feedback Available', 'Feedback for your Python Basics submission is now available.', 'feedback_available', 1, True, 1),
            (7, 'Assignment Due Soon', 'Your Research Paper is due in 5 days.', 'deadline_reminder', 3, False, 5),
            (4, 'Grade Posted', 'Your grade for Python Basics has been posted.', 'grade_posted', 1, False, 0.5)
        ]
        
        for user_index, title, message, notification_type, related_assignment_index, is_read, days_ago in notifications:
            user_id = user_ids[user_index]
            related_assignment_id = assignment_ids[related_assignment_index]
            scheduled_time = now - timedelta(days=days_ago)
            sent_time = scheduled_time
            
            cursor.execute(
                """
                INSERT INTO notifications (user_id, title, message, notification_type, related_assignment_id, is_read, scheduled_time, sent_time)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (user_id, title, message, notification_type, related_assignment_id, is_read, scheduled_time, sent_time)
            )
            print(f"Added notification for user #{user_index}")
        
        # Update User Preferences for some users
        print("\nUpdating user preferences...")
        preferences = [
            # Format: user_index, notification_deadline_hours, email_notifications, in_app_notifications, feedback_level, theme
            (4, 48, True, True, 'detailed', 'dark'),
            (5, 24, True, False, 'standard', 'light'),
            (7, 72, False, True, 'minimal', 'system')
        ]
        
        for user_index, notification_deadline_hours, email_notifications, in_app_notifications, feedback_level, theme in preferences:
            user_id = user_ids[user_index]
            
            cursor.execute(
                """
                UPDATE user_preferences
                SET notification_deadline_hours = %s, email_notifications = %s, in_app_notifications = %s, feedback_level = %s, theme = %s
                WHERE user_id = %s
                """,
                (notification_deadline_hours, email_notifications, in_app_notifications, feedback_level, theme, user_id)
            )
            print(f"Updated preferences for user #{user_index}")
        
        # Commit all changes
        conn.commit()
        
        # Print login information
        print("\n" + "="*50)
        print("DATABASE SETUP COMPLETE")
        print("="*50)
        print("\nYou can now login with the following credentials:")
        print("\nADMIN ACCESS:")
        print(f"Email: admin@university.edu")
        print(f"Password: admin123")
        print("\nPROFESSOR ACCESS:")
        for email, password, first_name, last_name, role, _ in users_with_passwords:
            if role == 'professor':
                print(f"Email: {email}")
                print(f"Password: {password}")
        print("\nSTUDENT ACCESS:")
        for email, password, first_name, last_name, role, _ in users_with_passwords:
            if role == 'student':
                print(f"Email: {email}")
                print(f"Password: {password}")
        print("\n" + "="*50)
        
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error: {e}")
    finally:
        if conn:
            if cursor:
                cursor.close()
            conn.close()

if __name__ == "__main__":
    setup_database()