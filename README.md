# Medical Residents E-Logbook

A web application for medical residents to track and manage their daily activities, procedures, and learning experiences.

## Features

- User authentication and authorization
- Activity logging with rich text editor (TinyMCE)
- Activity categorization (Out Patients, In Patients, Procedures, etc.)
- Activity filtering and search
- Dashboard with activity statistics
- Mobile responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for UI components
- Redux Toolkit for state management
- React Router for navigation
- TinyMCE (via jsDelivr CDN) for rich text editing
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd e-logbook
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Create a `.env` file in the server directory with the following content:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/e-logbook
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

4. Install client dependencies:
```bash
cd ../client
npm install
```

## Running the Application

1. Start the MongoDB server:
```bash
mongod
```

2. Start the backend server (in the server directory):
```bash
npm run dev
```

3. Start the frontend development server (in the client directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Activities
- GET `/api/activities` - Get all activities (with pagination and filters)
- POST `/api/activities` - Create new activity
- GET `/api/activities/:id` - Get single activity
- PUT `/api/activities/:id` - Update activity
- DELETE `/api/activities/:id` - Delete activity
- GET `/api/activities/stats` - Get activity statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
