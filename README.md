# GRADiEnt - AI-Powered Grading Assistant

GRADiEnt is an intelligent grading and feedback platform that uses AI to provide instant, detailed feedback on student submissions. The system helps educators save time on grading while providing students with consistent, comprehensive feedback to improve their learning outcomes.

## Features

- 🧠 **AI-Powered Analysis**: Automatic evaluation of assignments with detailed feedback
- 📊 **Comprehensive Analytics**: Track student progress and identify areas for improvement
- 🔍 **Plagiarism Detection**: Compare submissions for similarity and originality
- 📝 **Multiple Assignment Types**: Support for essays, code, presentations, and quizzes
- 👨‍🏫 **Professor Review**: AI-assisted grading with final human oversight
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL
- JWT Authentication

## Project Structure

```
gradient/
├── backend/               # FastAPI Python backend
│   ├── app/               # Main application code
│   │   ├── api/           # API endpoints and routes
│   │   ├── core/          # Core functionality (auth, security)
│   │   ├── database/      # Database models and connection
│   │   ├── models/        # Pydantic models for API
│   │   └── utils/         # Utility functions
├── frontend/              # React frontend
│   ├── public/            # Static assets
│   └── src/               # Source code
│       ├── components/    # Reusable React components
│       ├── context/       # React context for state management
│       ├── pages/         # Page components
│       └── services/      # API service integrations
└── database/              # Database scripts and seeds
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.9+)
- PostgreSQL

### Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/dixisouls/gradient.git
   cd gradient
   ```

2. Set up the backend
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Configure your database in app/config.py or use environment variables
   
   # Initialize the database
   python -m app.database.init_db
   
   # Run the backend server
   uvicorn app.main:app --reload
   ```

3. Set up the frontend
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Development

- Backend API docs: http://localhost:8000/docs
- Backend ReDoc: http://localhost:8000/redoc

## Deployment

Check the respective README files in the `frontend` and `backend` directories for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contributors

- Keyur Savalia
- Divya Panchal
- Dhvanil Bhagat
- Yash Patel
- Jacob Lazzarini
- Kevin Chuong

## License

This project is licensed under the MIT License.
