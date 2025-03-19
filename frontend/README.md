# GRADiEnt Frontend

This directory contains the React frontend for the GRADiEnt AI-powered grading assistant platform.

## Features

- **Responsive UI**: Modern interface that works on desktop and mobile devices
- **Role-Based Access**: Different views for students and professors
- **Dashboard**: Overview of courses, assignments, and recent activity
- **Course Management**: Browse, create, and manage courses
- **Assignment Management**: Submit, grade, and track assignments
- **Real-time Search**: Find courses, assignments, and users quickly
- **Profile Management**: Update user information and preferences

## Tech Stack

- **React**: UI library for building the interface
- **React Router**: For navigation and routing
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests
- **Context API**: For state management

## Prerequisites

- Node.js (v14+)
- npm or yarn

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Configure the API endpoint:
   - Update the API URL in `src/services/api.js` if needed (default: `http://localhost:8000/api/v1`)

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── public/                # Static assets
│   ├── logo.png           # Application logo
│   └── index.html         # HTML template
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared UI elements (buttons, cards, etc.)
│   │   ├── courses/       # Course-related components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── layout/        # Layout components (header, sidebar, footer)
│   │   ├── profile/       # User profile components
│   │   └── search/        # Search components
│   ├── context/           # React context providers
│   │   └── AuthContext.js # Authentication state management
│   ├── pages/             # Page components
│   │   ├── HomePage.js    # Landing page
│   │   ├── DashboardPage.js # User dashboard
│   │   ├── CoursesPage.js # Course listing page
│   │   └── ...            # Other page components
│   ├── services/          # API service integrations
│   │   ├── api.js         # Base API configuration
│   │   ├── authService.js # Authentication API methods
│   │   └── courseService.js # Course-related API methods
│   ├── App.js             # Main application component
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json          # Project dependencies and scripts
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App

## Styling

This project uses Tailwind CSS for styling, with custom extensions for:

- Gradient colors and effects
- Custom input fields and form elements
- Card layouts and animations
- Responsive design principles

Custom Tailwind theme configuration can be found in `tailwind.config.js`.

## Authentication

Authentication is handled through JWT tokens stored in localStorage. The auth flow includes:

- Login/Registration
- Token refresh
- Protected routes
- Role-based access control

## API Integration

All API requests are centralized in the `services` directory:

- `api.js`: Base axios configuration with interceptors for authentication
- `authService.js`: Authentication-related API calls
- `courseService.js`: Course-related API calls

## Deployment

1. Build the production bundle:
   ```bash
   npm run build
   # or 
   yarn build
   ```

2. The build artifacts will be in the `build` directory, which can be deployed to any static hosting service like:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

## Contributing

1. Follow the project coding style (Prettier/ESLint)
2. Create your feature branch from main
3. Add components according to the existing structure
4. Document new components and features
5. Create a pull request

## Connected Services

The frontend connects to the GRADiEnt backend API. Make sure to have the backend running on the expected URL.
