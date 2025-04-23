import bcrypt
import psycopg2
import re
import os
from datetime import datetime, timedelta


# Function to hash password with bcrypt
def hash_password(password):
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


# Database connection parameters - replace with your actual credentials
DB_PARAMS = {
    "dbname": "gradient",
    "user": "postgres",  # Replace with your PostgreSQL username
    "password": "Admin",  # Replace with your PostgreSQL password
    "host": "localhost",
    "port": "5432",
}

# User data with plain passwords
users_with_passwords = [
    # Format: email, password, first_name, last_name, role, phone_number
    (
        "smith.john@university.edu",
        "professor123",
        "John",
        "Smith",
        "professor",
        "555-123-4567",
    ),
    (
        "garcia.elena@university.edu",
        "professor123",
        "Elena",
        "Garcia",
        "professor",
        "555-234-5678",
    ),
    (
        "patel.raj@university.edu",
        "professor123",
        "Raj",
        "Patel",
        "professor",
        "555-345-6789",
    ),
    (
        "jones.sarah@university.edu",
        "student123",
        "Sarah",
        "Jones",
        "student",
        "555-456-7890",
    ),
    (
        "zhang.wei@university.edu",
        "student123",
        "Wei",
        "Zhang",
        "student",
        "555-567-8901",
    ),
    (
        "rodriguez.miguel@university.edu",
        "student123",
        "Miguel",
        "Rodriguez",
        "student",
        "555-678-9012",
    ),
    (
        "williams.alex@university.edu",
        "student123",
        "Alex",
        "Williams",
        "student",
        "555-789-0123",
    ),
    (
        "nguyen.kim@university.edu",
        "student123",
        "Kim",
        "Nguyen",
        "student",
        "555-890-1234",
    ),
    (
        "johnson.mike@university.edu",
        "student123",
        "Mike",
        "Johnson",
        "student",
        "555-901-2345",
    ),
    ("admin@university.edu", "admin123", "Admin", "User", "admin", "555-000-0000"),
]

# Course data
courses_data = [
    # Format: code, name, description, term
    (
        "CS101",
        "Introduction to Computer Science",
        "Fundamental concepts of programming and computer science.",
        "Spring 2025",
    ),
    (
        "ENG201",
        "Advanced Composition",
        "Advanced techniques for academic and professional writing.",
        "Spring 2025",
    ),
    (
        "MATH303",
        "Linear Algebra",
        "Vector spaces, linear transformations, matrices, and applications.",
        "Spring 2025",
    ),
    (
        "CS305",
        "Database Systems",
        "Design and implementation of database management systems.",
        "Spring 2025",
    ),
    (
        "BIO240",
        "Genetics",
        "Principles of inheritance and gene expression in organisms.",
        "Spring 2025",
    ),
]

# Course user relationships
course_users_data = [
    # Format: course_index, user_index, role
    # CS101 - Prof. Smith & Students
    (1, 1, "professor"),
    (1, 4, "student"),
    (1, 5, "student"),
    (1, 6, "student"),
    # ENG201 - Prof. Garcia & Students
    (2, 2, "professor"),
    (2, 7, "student"),
    (2, 8, "student"),
    # MATH303 - Prof. Patel & Students
    (3, 3, "professor"),
    (3, 4, "student"),
    (3, 9, "student"),
    # CS305 - Prof. Smith & Students
    (4, 1, "professor"),
    (4, 5, "student"),
    (4, 6, "student"),
    (4, 7, "student"),
    # BIO240 - Prof. Garcia & Students
    (5, 2, "professor"),
    (5, 8, "student"),
    (5, 9, "student"),
]


def setup_database():
    """Set up the gradient database with user and course sample data and known passwords"""
    conn = None
    try:
        # Connect to the database
        print("Connecting to the database...")
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Insert Users
        print("Inserting users with known passwords...")
        user_ids = {}  # Store the generated user IDs
        for i, (
            email,
            password,
            first_name,
            last_name,
            role,
            phone_number,
        ) in enumerate(users_with_passwords, 1):
            password_hash = hash_password(password)
            cursor.execute(
                """
                INSERT INTO users (email, password_hash, first_name, last_name, role, phone_number)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (email, password_hash, first_name, last_name, role, phone_number),
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
                (code, name, description, term),
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
                (course_id, user_id, role),
            )
            print(f"Assigned user #{user_index} to course #{course_index} as {role}")

        # Update User Preferences for some users
        print("\nUpdating user preferences...")
        preferences = [
            # Format: user_index, notification_deadline_hours, email_notifications, in_app_notifications, feedback_level, theme
            (4, 48, True, True, "detailed", "dark"),
            (5, 24, True, False, "standard", "light"),
            (7, 72, False, True, "minimal", "system"),
        ]

        for (
            user_index,
            notification_deadline_hours,
            email_notifications,
            in_app_notifications,
            feedback_level,
            theme,
        ) in preferences:
            user_id = user_ids[user_index]

            cursor.execute(
                """
                UPDATE user_preferences
                SET notification_deadline_hours = %s, email_notifications = %s, in_app_notifications = %s, feedback_level = %s, theme = %s
                WHERE user_id = %s
                """,
                (
                    notification_deadline_hours,
                    email_notifications,
                    in_app_notifications,
                    feedback_level,
                    theme,
                    user_id,
                ),
            )
            print(f"Updated preferences for user #{user_index}")

        # Commit all changes
        conn.commit()

        # Print login information
        print("\n" + "=" * 50)
        print("DATABASE SETUP COMPLETE")
        print("=" * 50)
        print("\nYou can now login with the following credentials:")
        print("\nADMIN ACCESS:")
        print(f"Email: admin@university.edu")
        print(f"Password: admin123")
        print("\nPROFESSOR ACCESS:")
        for email, password, first_name, last_name, role, _ in users_with_passwords:
            if role == "professor":
                print(f"Email: {email}")
                print(f"Password: {password}")
        print("\nSTUDENT ACCESS:")
        for email, password, first_name, last_name, role, _ in users_with_passwords:
            if role == "student":
                print(f"Email: {email}")
                print(f"Password: {password}")
        print("\n" + "=" * 50)

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
