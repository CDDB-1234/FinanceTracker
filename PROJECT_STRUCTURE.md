# Finance Tracker Project Structure

```
FinanceTracker/
│
├── frontend/                          # React Application
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # API client with auth headers
│   │   ├── pages/
│   │   │   ├── LoginPage.js          # Login/Register component
│   │   │   └── Dashboard.js          # Dashboard component (protected)
│   │   ├── styles/
│   │   │   ├── LoginPage.css         # Login page styles
│   │   │   └── Dashboard.css         # Dashboard styles
│   │   ├── App.js                    # Main app with routing
│   │   ├── App.css                   # App styles
│   │   └── index.js                  # React entry point
│   ├── .env.example                  # Environment template
│   └── package.json                  # Frontend dependencies
│
├── backend/                           # Python Flask Application
│   ├── config/
│   │   ├── __init__.py
│   │   └── database.py               # MongoDB configuration
│   ├── routes/
│   │   ├── __init__.py
│   │   └── auth.py                   # Authentication routes
│   ├── services/
│   │   ├── __init__.py
│   │   └── auth_service.py           # Auth business logic
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth_middleware.py        # JWT verification middleware
│   ├── utils/
│   │   ├── __init__.py
│   │   └── helpers.py                # Utility functions
│   ├── app.py                        # Main Flask application
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Environment variables
│   └── __init__.py
│
├── .github/
│   └── copilot-instructions.md       # Project setup checklist
├── .gitignore                        # Git ignore rules
├── README.md                         # Project documentation
└── STARTUP.md                        # Quick start guide

```

## Technology Stack

### Frontend
- **React 18** - UI library
- **React Router 6** - Page routing
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Flask 3.0** - Web framework
- **PyMongo 4.6** - MongoDB driver
- **PyJWT 2.8** - JWT token generation/verification
- **bcrypt 4.1** - Password hashing
- **Flask-CORS 4.0** - Cross-origin requests

### Database
- **MongoDB** - NoSQL database

## Key Features Implemented

### Authentication System
✅ User Registration with email validation
✅ User Login with JWT tokens
✅ Password hashing with bcrypt
✅ Protected dashboard routes
✅ Token-based authentication

### Frontend Components
✅ Login/Register page with toggle
✅ Form validation
✅ Error handling with user feedback
✅ Secure token storage (localStorage)
✅ Protected route navigation
✅ Logout functionality
✅ Dashboard with user greeting

### Backend API
✅ POST /api/auth/register - User registration
✅ POST /api/auth/login - User authentication
✅ GET /api/auth/verify - Token verification
✅ JWT middleware for protected routes
✅ CORS enabled for frontend communication
✅ MongoDB database integration
✅ Error handling and validation

## How It Works

### Registration Flow
1. User fills registration form
2. Frontend validates form data
3. Sends to backend `/api/auth/register`
4. Backend hashes password with bcrypt
5. Creates user document in MongoDB
6. Returns JWT token
7. Frontend stores token in localStorage
8. Redirects to dashboard

### Login Flow
1. User enters email and password
2. Frontend validates input
3. Sends to backend `/api/auth/login`
4. Backend verifies credentials
5. Generates JWT token
6. Returns token and user data
7. Frontend stores token
8. Redirects to dashboard

### Protected Routes
1. Dashboard route checks for token
2. If no token → redirect to login
3. If token exists → display dashboard
4. Logout clears token and user data

## Security Features
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens with HS256 algorithm
- CORS protection
- Token validation middleware
- Protected API endpoints
- Environment variable management

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique index),
  password: String (bcrypt hash),
  created_at: DateTime
}
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/
DB_NAME=finance_tracker
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
FLASK_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Installation & Setup

See `STARTUP.md` for detailed setup instructions.

### Quick Commands

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## API Response Examples

### Register Success (201)
```json
{
  "message": "User registered successfully",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Register Error (409 - User Exists)
```json
{
  "message": "User already exists"
}
```

### Login Success (200)
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login Error (401)
```json
{
  "message": "Invalid email or password"
}
```

## Next Steps for Development

1. **Transaction Management**
   - Add transaction routes (CRUD)
   - Create transaction models
   - Add transaction UI components

2. **Budget Tracking**
   - Budget creation and management
   - Budget vs actual comparison
   - Alert system for overspending

3. **Financial Reports**
   - Monthly spending analysis
   - Category-wise breakdown
   - Export to CSV/PDF

4. **Category Management**
   - User-defined categories
   - Category-wise transactions
   - Budget allocation per category

5. **User Profile**
   - Profile settings page
   - Change password
   - Account preferences

6. **Recurring Transactions**
   - Set up recurring payments
   - Automatic transaction creation
   - Recurring transaction management

## Troubleshooting

### Common Issues
- **MongoDB Connection** - Ensure MongoDB is running
- **CORS Errors** - Check backend is running on port 5000
- **Port Already in Use** - Kill process or change port
- **Module Errors** - Install dependencies (pip/npm)

See `STARTUP.md` for detailed troubleshooting.

## File Sizes

- Frontend: ~15 KB (all React files)
- Backend: ~12 KB (all Python files)
- Total: ~27 KB of source code
- Total: ~400 MB with node_modules and dependencies
