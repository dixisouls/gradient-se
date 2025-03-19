#!/bin/bash

# Green color for success messages
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to run backend
run_backend() {
  cd backend
  source venv/bin/activate
  echo -e "${GREEN}Backend started${NC}"
  uvicorn app.main:app --reload
  cd ..
}

# Function to run frontend
run_frontend() {
  cd frontend
  echo -e "${GREEN}Frontend started${NC}"
  npm start
  cd ..
}

# Check arguments
if [ "$1" == "backend" ]; then
  run_backend
elif [ "$1" == "frontend" ]; then
  run_frontend
else
  # Run both (backend in background)
  run_backend &
  run_frontend
fi