# Event Management System

A modern React frontend for managing events and expenses with a Node.js/Express backend.

## Features

- User authentication (login)
- Event management (create, view, delete)
- Expense tracking per event
- Budget monitoring with visual indicators
- Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- RESTful API

## Project Structure

```
EventManagementSystem/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── EventCard.jsx
    │   │   ├── ExpenseList.jsx
    │   │   ├── SummaryCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── EventDetails.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # JWT_SECRET=your_secret_key
   # MONGODB_URI=mongodb://localhost:27017/eventdb
   npm start
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Usage

1. Register/Login at `http://localhost:5174`
2. Create events on the dashboard
3. View event details and add expenses
4. Monitor budget with the summary card

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Expenses
- `GET /api/events/:id/expenses` - Get event expenses
- `POST /api/events/:id/expenses` - Add expense

### Budget
- `GET /api/events/:id/summary` - Get budget summary

## Development

- Frontend runs on `http://localhost:5174`
- Backend runs on `http://localhost:5000`
- Hot reload enabled for both

## Features Overview

### Authentication
- JWT-based authentication
- Protected routes
- Token stored in localStorage

### Dashboard
- List all user events
- Create new events
- Responsive card layout

### Event Details
- View event information
- Add/manage expenses
- Budget tracking with progress bar
- Visual indicators for budget status

### UI/UX
- Modern, clean design
- Responsive layout
- Loading states
- Error handling
- Intuitive navigation