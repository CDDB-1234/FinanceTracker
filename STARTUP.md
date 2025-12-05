# Finance Tracker - Startup Guide

## Quick Start

### Prerequisites
- Node.js 14+ (for frontend)
- Python 3.8+ (for backend)
- MongoDB running locally or cloud connection

### Backend Setup (Python)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   - Windows: `python -m venv venv`
   - macOS/Linux: `python3 -m venv venv`

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment:**
   - Edit `.env` file with your MongoDB URI
   - Default: `MONGO_URI=mongodb://localhost:27017/`

6. **Run Flask server:**
   ```bash
   python app.py
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm start
   ```
   App will open at `http://localhost:3000`

## Testing the Application

### 1. Register a New User
- Go to login page
- Click "Register"
- Fill in name, email, password
- Submit

### 2. Login
- Use your registered email and password
- You'll be redirected to dashboard

### 3. Logout
- Click logout button in dashboard
- You'll be redirected to login page

## Troubleshooting

### MongoDB Connection Error
```
Error connecting to MongoDB
```
**Solution:** 
- Ensure MongoDB is running (`mongod`)
- Check connection string in `.env`
- For MongoDB Atlas, use full connection string with credentials

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Backend is running on port 5000
- Frontend is running on port 3000
- CORS is enabled in Flask app

### Port Already in Use
```
Address already in use
```
**Solution:**
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)
- Kill process on port 3000: `npx kill-port 3000`

### Module Not Found (Python)
```
ModuleNotFoundError: No module named 'flask'
```
**Solution:**
- Activate virtual environment
- Run `pip install -r requirements.txt`

### npm packages missing
```
Cannot find module 'react'
```
**Solution:**
- Run `npm install` in frontend directory

## API Documentation

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: 201 Created
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

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
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

### Verify Token
```
GET /api/auth/verify
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

Response: 200 OK
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-12-03T10:00:00.000000"
  }
}
```

## Next Steps

After setting up the login system, you can extend the application with:
- Transaction management endpoints
- Budget tracking features
- Financial reports
- Category management
- User profile management

See README.md for full project documentation.
