# User Feedback System

A full-stack web application for collecting, displaying, and analyzing user feedback. This project consists of a React frontend with Material UI and a Node.js/Express backend with MongoDB.

![User Feedback System](https://via.placeholder.com/800x400?text=User+Feedback+System)

## Features

- **Submit Feedback**: Users can submit feedback with name, email, message, and category
- **Real-time Dashboard**: View all feedback submissions with sorting and filtering capabilities
- **Data Analysis**: Visual representation of feedback data through charts 
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes

## Tech Stack

### Frontend
- React 19
- Material UI 7
- Recharts (for data visualization)
- Axios (for API calls)
- Vite (for build tooling)

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

## Project Structure

```
/Assignment
│
├── /frontend                # React frontend application
│   ├── /src
│   │   ├── /components      # React components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
└── /backend                 # Node.js/Express backend
    ├── /config              # Database configuration
    ├── /controllers         # Route controllers
    ├── /models              # Database models
    ├── /routes              # API routes
    ├── server.js            # Express server setup
    └── package.json         # Backend dependencies
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Assignment
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following content
echo "MONGODB_URI=mongodb://localhost:27017/feedbackDB\nPORT=5001" > .env

# Start the backend server
npm run dev
```

The backend server will run on http://localhost:5001

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend development server will run on http://localhost:5173

## Usage

### Submitting Feedback

1. Fill in the feedback form with your name, email, feedback text and category
2. Click "Submit Feedback" button
3. You'll see a success message when your feedback is submitted

### Viewing the Dashboard

- The dashboard displays all submitted feedback
- Use the filter dropdown to filter by category
- Use the sort dropdown to sort by different attributes
- Use the search box to search for specific feedback
- Pagination controls are at the bottom of the table

### Analyzing Feedback

- The analysis section shows distribution of feedback by category
- Toggle between pie chart and bar chart views
- View stats like total feedback count and most common category

## API Endpoints

### Feedback Endpoints

| Method | URL                     | Description                | Query Parameters                                |
|--------|-----------------------------|----------------------------|------------------------------------------------|
| GET    | `/feedback`                 | Get all feedback           | `category`: Filter by category                  |
|        |                             |                            | `sortBy`: Sort by field:order (e.g. `name:asc`) |
| POST   | `/feedback`                 | Submit a new feedback      | N/A                                            |

## Development

### Environment Variables

#### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Port number for the backend server (default: 5001)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Make sure MongoDB is running locally or your connection string is correct
   - Check MongoDB Atlas network access settings if using Atlas

2. **Port Already in Use**
   - Change the port in the .env file if port 5001 is already in use

3. **CORS Issues**
   - The backend is configured to allow all origins. For production, adjust CORS policy in server.js

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Recharts](https://recharts.org/)
