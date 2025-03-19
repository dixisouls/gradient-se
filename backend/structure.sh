#!/bin/bash

# Script to create directory structure and empty files for GRADiEnt FastAPI project
# Assumes the main directory already exists

# Create the main app directory structure
mkdir -p app/database
mkdir -p app/api/v1/endpoints
mkdir -p app/models
mkdir -p app/core
mkdir -p app/utils

# Create empty files - App level
touch app/__init__.py
touch app/main.py
touch app/config.py

# Create empty files - Database
touch app/database/__init__.py
touch app/database/db.py
touch app/database/models.py

# Create empty files - API
touch app/api/__init__.py
touch app/api/dependencies.py
touch app/api/v1/__init__.py
touch app/api/v1/router.py
touch app/api/v1/endpoints/__init__.py
touch app/api/v1/endpoints/auth.py
touch app/api/v1/endpoints/users.py
touch app/api/v1/endpoints/courses.py
touch app/api/v1/endpoints/search.py

# Create empty files - Models
touch app/models/__init__.py
touch app/models/user.py
touch app/models/course.py
touch app/models/token.py
touch app/models/search.py

# Create empty files - Core
touch app/core/__init__.py
touch app/core/auth.py
touch app/core/security.py

# Create empty files - Utils
touch app/utils/__init__.py
touch app/utils/password.py

# Create root level files
touch requirements.txt

echo "Directory structure and empty files created successfully!"
echo "
Created structure:
- app/
  - __init__.py
  - main.py
  - config.py
  - database/
    - __init__.py
    - db.py
    - models.py
  - api/
    - __init__.py
    - dependencies.py
    - v1/
      - __init__.py
      - router.py
      - endpoints/
        - __init__.py
        - auth.py
        - users.py
        - courses.py
        - search.py
  - models/
    - __init__.py
    - user.py
    - course.py
    - token.py
    - search.py
  - core/
    - __init__.py
    - auth.py
    - security.py
  - utils/
    - __init__.py
    - password.py
- requirements.txt
"