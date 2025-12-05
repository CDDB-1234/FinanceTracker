# Finance Tracker - Quick Reference

## Getting Started (5 minutes)

### 1. MongoDB Setup
- **Local**: Download MongoDB Community and run `mongod`
- **Cloud**: Use MongoDB Atlas (free tier available)
- Update `MONGO_URI` in `backend/.env`

### 2. Backend (Terminal 1)
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
# Backend running on http://localhost:5000
```

### 3. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
# Frontend running on http://localhost:3000
```

### 4. Test Application
1. Open http://localhost:3000
2. Click "Register"
3. Fill in details and submit
4. Should redirect to dashboard
5. Click logout to test
6. Try login with credentials

## Project Files Overview

| File | Purpose |
|------|---------|
| `backend/app.py` | Flask server entry point |
| `backend/routes/auth.py` | Authentication endpoints |
| `backend/services/auth_service.py` | Auth logic (register, login) |
| `backend/middleware/auth_middleware.py` | JWT token verification |
| `frontend/src/App.js` | React router configuration |
| `frontend/src/pages/LoginPage.js` | Login/Register UI |
| `frontend/src/pages/Dashboard.js` | Dashboard UI |
| `frontend/src/api/client.js` | API communication |

## Common Tasks

### Add a new API endpoint
1. Create function in `backend/routes/auth.py`
2. Add to auth blueprint
3. Use `@token_required` decorator for protection

### Add a new frontend page
1. Create component in `frontend/src/pages/`
2. Add stylesheet in `frontend/src/styles/`
3. Add route in `frontend/src/App.js`

### Debug Backend
```python
# Add print statements
print(f"Debug: {variable}")
# Check MongoDB
mongosh  # or mongo shell
db.finance_tracker.users.find()
```

### Debug Frontend
- Open browser DevTools (F12)
- Console tab shows errors
- Network tab shows API calls
- Check localStorage: `localStorage.getItem('token')`

## Key Endpoints

| Method | URL | Auth | Purpose |
|--------|-----|------|---------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/verify` | Yes | Verify token |

## Frontend Components

| Component | Location | Purpose |
|-----------|----------|---------|
| LoginPage | `pages/LoginPage.js` | Auth UI |
| Dashboard | `pages/Dashboard.js` | Main content |
| App | `src/App.js` | Routing |

## State Management

### localStorage
- `token` - JWT token
- `user` - User object {id, name, email}

### React State
- `isLogin` - Toggle between login/register
- `email`, `password`, `name` - Form inputs
- `error` - Error messages
- `loading` - Loading state

## Validation

### Frontend
- Email format check
- Password min 6 chars
- Name required for register
- All fields required

### Backend
- Email uniqueness
- Password min 6 chars
- Email/password required for login
- Token format validation

## Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Missing fields | Fill all form fields |
| 401 | Invalid credentials | Check email/password |
| 409 | User exists | Use different email |
| 500 | Server error | Check backend logs |

## Development Workflow

### 1. Start Services
```bash
# Terminal 1 - MongoDB
mongod

# Terminal 2 - Backend
cd backend && source venv/bin/activate && python app.py

# Terminal 3 - Frontend
cd frontend && npm start
```

### 2. Make Changes
- Edit backend: Restart Flask (Ctrl+C, python app.py)
- Edit frontend: Hot reload automatic

### 3. Test Changes
- Frontend: http://localhost:3000
- Backend API: Use Postman or curl
- MongoDB: Use mongosh

### 4. Debug
- Backend: Check console output, add print()
- Frontend: DevTools Console, Network tab
- Database: Direct query with mongosh

## Performance Tips

- Use DevTools Lighthouse for frontend
- Monitor MongoDB query performance
- Use indexing on frequently queried fields
- Cache tokens in localStorage

## Security Reminders

⚠️ **Before Production:**
- [ ] Change SECRET_KEY in backend/.env
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Use production MongoDB URI
- [ ] Set FLASK_ENV=production
- [ ] Use strong SECRET_KEY

## Useful Commands

```bash
# Check if ports are in use
lsof -i :5000    # Backend port
lsof -i :3000    # Frontend port

# Kill process on port
kill -9 <PID>

# View MongoDB databases
mongosh
> show databases
> db.finance_tracker.users.find()

# Clear npm cache
npm cache clean --force

# Install specific package version
npm install package@version

# Test API endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'
```

## File Checklist

✅ Backend
- [ ] `backend/app.py` - Main server
- [ ] `backend/requirements.txt` - Dependencies
- [ ] `backend/.env` - Config
- [ ] `backend/routes/auth.py` - Auth routes
- [ ] `backend/services/auth_service.py` - Auth logic
- [ ] `backend/middleware/auth_middleware.py` - Token check

✅ Frontend
- [ ] `frontend/package.json` - Dependencies
- [ ] `frontend/src/App.js` - Router setup
- [ ] `frontend/src/pages/LoginPage.js` - Auth UI
- [ ] `frontend/src/pages/Dashboard.js` - Main page
- [ ] `frontend/src/api/client.js` - API calls

✅ Configuration
- [ ] `.gitignore` - Ignore files
- [ ] `README.md` - Documentation
- [ ] `STARTUP.md` - Setup guide
- [ ] `PROJECT_STRUCTURE.md` - Architecture

## Support

For issues:
1. Check browser console (F12)
2. Check backend terminal output
3. Check MongoDB connection
4. Review error codes above
5. See STARTUP.md troubleshooting section
