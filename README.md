# Finance Tracker Application

A full-stack finance tracking application built with React, Python Flask, and MongoDB.

## Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Python Flask, PyJWT, bcrypt
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
FinanceTracker/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── pages/           # Page components (LoginPage, Dashboard)
│   │   ├── styles/          # CSS files
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   └── package.json
│
├── backend/                  # Python Flask application
│   ├── config/              # Configuration files
│   │   └── database.py
│   ├── services/            # Business logic
│   │   └── auth_service.py
│   ├── routes/              # API endpoints
│   │   └── auth.py
│   ├── middleware/          # Middleware functions
│   │   └── auth_middleware.py
│   ├── app.py               # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- **Windows**: `venv\Scripts\activate`
- **macOS/Linux**: `source venv/bin/activate`
### Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
   - Update `.env` file with your MongoDB URI and secret key
   - Default: `MONGO_URI=mongodb://localhost:27017/`

6. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Features

### Current Features
- **User Registration**: Create a new account with email and password
- **User Login**: Authenticate with email and password
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Dashboard only accessible to authenticated users
- **Logout**: Clear session and return to login

### Planned Features
- Transaction management (add, edit, delete transactions)
- Budget tracking
- Financial reports and analytics
- Category management
- Recurring transactions
- Export data to CSV/PDF

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  - Request: `{ name, email, password }`
  - Response: `{ token, user }`

- `POST /api/auth/login` - Login user
  - Request: `{ email, password }`
  - Response: `{ token, user }`

- `GET /api/auth/verify` - Verify token
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

## Security Notes

- Passwords are hashed using bcrypt before storing
- JWT tokens are used for stateless authentication
- CORS is enabled for local development
- Update `SECRET_KEY` in `.env` for production
- Use HTTPS in production environment

## MongoDB Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  created_at: DateTime
}
```

## Development

### Adding New Backend Routes

1. Create a new route file in `backend/routes/`
2. Use the `token_required` middleware for protected routes
3. Register the blueprint in `app.py`

### Adding New Frontend Pages

1. Create a new component in `frontend/src/pages/`
2. Add styling in `frontend/src/styles/`
3. Add route in `frontend/src/App.js`

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running locally or provide correct URI in `.env`

**CORS Error**
- Frontend and backend should be on different ports
- Ensure CORS is enabled in Flask backend

**Token Validation Error**
- Check that `Authorization` header format is `Bearer <token>`
- Verify `SECRET_KEY` matches between token generation and validation

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
