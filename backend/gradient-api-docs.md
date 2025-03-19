# GRADiEnt API Documentation

This document provides comprehensive documentation for the GRADiEnt API, including endpoint descriptions, request payloads, and response formats.

## Base URL

```
http://<host>:<port>/api/v1
```

## Authentication

Most endpoints require authorization via JWT token. Include the token in the request header:

```
Authorization: Bearer <access_token>
```

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Course APIs](#course-apis)
4. [Search APIs](#search-apis)

---

## Authentication APIs

### Register User

Register a new user in the system.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "student@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "phone_number": "555-123-4567"
}
```

**Role options**: `student`, `professor`, `admin`

**Response** (201 Created):

```json
{
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "phone_number": "555-123-4567",
  "id": 1,
  "is_active": true,
  "created_at": "2025-03-18T10:00:00.000000",
  "updated_at": "2025-03-18T10:00:00.000000",
  "last_login": null
}
```

**Error Responses**:
- 400 Bad Request: If user with email already exists

### Login

Authenticate a user and obtain an access token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body** (form data):

```
username: student@example.com
password: password123
```

**Response** (200 OK):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- 401 Unauthorized: Incorrect email or password

### Refresh Token

Refresh access token for continued authorization.

- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Auth Required**: Yes

**Response** (200 OK):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## User APIs

### Get Current User Info

Get information about the currently authenticated user.

- **URL**: `/users/me`
- **Method**: `GET`
- **Auth Required**: Yes

**Response** (200 OK):

```json
{
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "phone_number": "555-123-4567",
  "id": 1,
  "is_active": true,
  "created_at": "2025-03-18T10:00:00.000000",
  "updated_at": "2025-03-18T10:00:00.000000",
  "last_login": "2025-03-18T11:30:00.000000"
}
```

### Update Current User

Update information for the currently authenticated user.

- **URL**: `/users/me`
- **Method**: `PUT`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "555-987-6543"
}
```

**Response** (200 OK):

```json
{
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "role": "student",
  "phone_number": "555-987-6543",
  "id": 1,
  "is_active": true,
  "created_at": "2025-03-18T10:00:00.000000",
  "updated_at": "2025-03-18T12:00:00.000000",
  "last_login": "2025-03-18T11:30:00.000000"
}
```

### Get User Courses

Get courses enrolled by the current user.

- **URL**: `/users/me/courses`
- **Method**: `GET`
- **Auth Required**: Yes

**Response** (200 OK):

```json
[
  {
    "code": "CS401",
    "name": "Advanced Algorithms",
    "description": "Study of advanced algorithms and computational complexity.",
    "term": "Spring 2025",
    "id": 1,
    "created_at": "2025-03-18T10:00:00.000000",
    "updated_at": "2025-03-18T10:00:00.000000"
  },
  {
    "code": "MATH401",
    "name": "Advanced Calculus",
    "description": "Rigorous treatment of calculus concepts including limits, continuity, and differentiation.",
    "term": "Spring 2025",
    "id": 5,
    "created_at": "2025-03-18T10:00:00.000000",
    "updated_at": "2025-03-18T10:00:00.000000"
  }
]
```

### Select User Courses

Select courses for the current user to enroll in.

- **URL**: `/users/me/courses`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "course_ids": [1, 3, 5]
}
```

**Response** (200 OK):

```json
[
  {
    "code": "CS401",
    "name": "Advanced Algorithms",
    "description": "Study of advanced algorithms and computational complexity.",
    "term": "Spring 2025",
    "id": 1,
    "created_at": "2025-03-18T10:00:00.000000",
    "updated_at": "2025-03-18T10:00:00.000000"
  },
  {
    "code": "ENG301",
    "name": "Technical Writing",
    "description": "Advanced technical writing skills for engineers and scientists.",
    "term": "Spring 2025",
    "id": 3,
    "created_at": "2025-03-18T10:00:00.000000",
    "updated_at": "2025-03-18T10:00:00.000000"
  },
  {
    "code": "MATH401",
    "name": "Advanced Calculus",
    "description": "Rigorous treatment of calculus concepts including limits, continuity, and differentiation.",
    "term": "Spring 2025",
    "id": 5,
    "created_at": "2025-03-18T10:00:00.000000",
    "updated_at": "2025-03-18T10:00:00.000000"
  }
]
```

**Error Responses**:
- 404 Not Found: One or more courses not found

---

## Course APIs

### Get All Courses

Get all courses with optional filtering.

- **URL**: `/courses`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `skip` (integer, optional): Number of courses to skip (default: 0)
  - `limit` (integer, optional): Maximum number of courses to return (default: 100)
  - `term` (string, optional): Filter by term

**Response** (200 OK):

```json
{
  "courses": [
    {
      "code": "CS401",
      "name": "Advanced Algorithms",
      "description": "Study of advanced algorithms and computational complexity.",
      "term": "Spring 2025",
      "id": 1,
      "created_at": "2025-03-18T10:00:00.000000",
      "updated_at": "2025-03-18T10:00:00.000000"
    },
    {
      "code": "CS450",
      "name": "Machine Learning",
      "description": "Introduction to machine learning algorithms and applications.",
      "term": "Spring 2025",
      "id": 2,
      "created_at": "2025-03-18T10:00:00.000000",
      "updated_at": "2025-03-18T10:00:00.000000"
    }
  ],
  "total": 2
}
```

### Get Course by ID

Get a specific course by ID.

- **URL**: `/courses/{course_id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **Path Parameters**:
  - `course_id` (integer): Course ID

**Response** (200 OK):

```json
{
  "code": "CS401",
  "name": "Advanced Algorithms",
  "description": "Study of advanced algorithms and computational complexity.",
  "term": "Spring 2025",
  "id": 1,
  "created_at": "2025-03-18T10:00:00.000000",
  "updated_at": "2025-03-18T10:00:00.000000"
}
```

**Error Responses**:
- 404 Not Found: Course not found

### Create Course

Create a new course (professors and admins only).

- **URL**: `/courses`
- **Method**: `POST`
- **Auth Required**: Yes (Professor or Admin role required)

**Request Body**:

```json
{
  "code": "CS500",
  "name": "Advanced Database Systems",
  "description": "Advanced topics in database design and implementation.",
  "term": "Spring 2025"
}
```

**Response** (201 Created):

```json
{
  "code": "CS500",
  "name": "Advanced Database Systems",
  "description": "Advanced topics in database design and implementation.",
  "term": "Spring 2025",
  "id": 6,
  "created_at": "2025-03-18T14:00:00.000000",
  "updated_at": "2025-03-18T14:00:00.000000"
}
```

**Error Responses**:
- 400 Bad Request: Course with code and term already exists
- 403 Forbidden: User doesn't have enough privileges

### Update Course

Update an existing course (professors and admins only).

- **URL**: `/courses/{course_id}`
- **Method**: `PUT`
- **Auth Required**: Yes (Professor or Admin role required)
- **Path Parameters**:
  - `course_id` (integer): Course ID

**Request Body**:

```json
{
  "name": "Advanced Database Systems and Applications",
  "description": "Advanced topics in database design, implementation, and applications."
}
```

**Response** (200 OK):

```json
{
  "code": "CS500",
  "name": "Advanced Database Systems and Applications",
  "description": "Advanced topics in database design, implementation, and applications.",
  "term": "Spring 2025",
  "id": 6,
  "created_at": "2025-03-18T14:00:00.000000",
  "updated_at": "2025-03-18T14:30:00.000000"
}
```

**Error Responses**:
- 404 Not Found: Course not found
- 403 Forbidden: User doesn't have enough privileges

### Seed Courses

Seed database with additional predefined courses (professors and admins only).

- **URL**: `/courses/seed`
- **Method**: `POST`
- **Auth Required**: Yes (Professor or Admin role required)

**Response** (201 Created):

```json
{
  "message": "Successfully added 5 new courses",
  "total_added": 5
}
```

**Error Responses**:
- 403 Forbidden: User doesn't have enough privileges

---

## Search APIs

### Basic Search

Perform a basic search across entities.

- **URL**: `/search/basic`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `query` (string, required): Search query
  - `entity_type` (string, optional): Entity type to search (course, assignment, user)
  - `page` (integer, optional): Page number (default: 1)
  - `per_page` (integer, optional): Items per page (default: 10, max: 100)

**Response** (200 OK):

```json
{
  "results": [
    {
      "id": 2,
      "type": "course",
      "title": "CS450: Machine Learning",
      "description": "Introduction to machine learning algorithms and applications.",
      "relevance": 1.0,
      "metadata": {
        "term": "Spring 2025"
      }
    },
    {
      "id": 1,
      "type": "course",
      "title": "CS401: Advanced Algorithms",
      "description": "Study of advanced algorithms and computational complexity.",
      "relevance": 0.7,
      "metadata": {
        "term": "Spring 2025"
      }
    }
  ],
  "total": 2,
  "page": 1,
  "per_page": 10,
  "pages": 1
}
```

### Advanced Search

Perform an advanced search with filters and sorting.

- **URL**: `/search/advanced`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "query": "computer",
  "entity_type": "course",
  "filters": {
    "term": "Spring 2025"
  },
  "sort_by": "name",
  "sort_direction": "asc",
  "page": 1,
  "per_page": 10
}
```

**Valid entity_type values**: `course`, `assignment`, `user`  
**Valid sort_direction values**: `asc`, `desc`

**Response** (200 OK):

```json
{
  "results": [
    {
      "id": 1,
      "type": "course",
      "title": "CS401: Advanced Algorithms",
      "description": "Study of advanced algorithms and computational complexity.",
      "relevance": 0.9,
      "metadata": {
        "term": "Spring 2025"
      }
    },
    {
      "id": 2,
      "type": "course",
      "title": "CS450: Machine Learning",
      "description": "Introduction to machine learning algorithms and applications.",
      "relevance": 0.7,
      "metadata": {
        "term": "Spring 2025"
      }
    }
  ],
  "total": 2,
  "page": 1,
  "per_page": 10,
  "pages": 1
}
```

## Error Structure

All API errors follow a consistent structure:

```json
{
  "detail": "Error message description"
}
```

## Common Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
