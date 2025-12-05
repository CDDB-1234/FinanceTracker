# Finance Tracker - Setup Checklist

## Pre-Installation Requirements

- [ ] Node.js installed (v14 or higher)
  ```bash
  node --version
  ```

- [ ] Python installed (v3.8 or higher)
  ```bash
  python --version
  ```

- [ ] MongoDB installed locally OR MongoDB Atlas account
  ```bash
  mongod --version
  ```

- [ ] Git installed (optional)
  ```bash
  git --version
  ```

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```
- [ ] Virtual environment created

### Step 3: Activate Virtual Environment
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```
- [ ] Virtual environment activated (you should see `(venv)` in prompt)

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```
- [ ] All Python packages installed
- [ ] Should complete without errors

### Step 5: Configure Environment
- [ ] Edit `backend/.env`
- [ ] Update `MONGO_URI` if not using local MongoDB
  - Local: `mongodb://localhost:27017/`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/`
- [ ] Keep `SECRET_KEY` for development (change in production)

### Step 6: Test MongoDB Connection
```bash
python -c "from pymongo import MongoClient; print(MongoClient('mongodb://localhost:27017/'))"
```
- [ ] MongoDB connection successful

### Step 7: Start Flask Server
```bash
python app.py
```
- [ ] Server starts successfully
- [ ] Should see: "✓ Connected to MongoDB database: finance_tracker"
- [ ] Should see: "Running on http://0.0.0.0:5000"
- [ ] Keep this terminal running

## Frontend Setup

### Step 1: Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```
- [ ] All npm packages installed
- [ ] node_modules folder created
- [ ] package-lock.json created

### Step 3: (Optional) Create Environment File
- [ ] Create `.env` file in frontend directory
- [ ] Add: `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] If not created, app will use default localhost:5000

### Step 4: Start React Development Server
```bash
npm start
```
- [ ] React app starts successfully
- [ ] Browser opens automatically to http://localhost:3000
- [ ] Should see login page with gradient background
- [ ] Keep this terminal running

## Verification

### Backend Verification
Test backend is working:
```bash
curl http://localhost:5000/api/health
```
- [ ] Should return: `{"status":"healthy","message":"Finance Tracker API is running"}`

### Frontend Verification
- [ ] Visit http://localhost:3000 in browser
- [ ] Should see Finance Tracker login page
- [ ] Should see registration toggle option

### API Connection Verification
1. Open browser DevTools (F12)
2. Go to Network tab
3. Fill registration form and submit
4. Check for POST request to `/api/auth/register`
- [ ] Request shows 201 status (success)
- [ ] Response includes token and user data

## Testing the Application

### Test 1: User Registration
- [ ] Click "Register" button
- [ ] Enter name: "Test User"
- [ ] Enter email: "test@example.com"
- [ ] Enter password: "Test123456"
- [ ] Click Register
- [ ] Should redirect to dashboard
- [ ] Should show "Welcome, Test User"

### Test 2: User Logout
- [ ] Click "Logout" button on dashboard
- [ ] Should redirect to login page

### Test 3: User Login
- [ ] Enter email: "test@example.com"
- [ ] Enter password: "Test123456"
- [ ] Click Login
- [ ] Should redirect to dashboard
- [ ] Should show same user

### Test 4: Validation Testing
- [ ] Try registering with same email (should show error)
- [ ] Try login with wrong password (should show error)
- [ ] Try form with empty fields (should show error)
- [ ] Try password less than 6 chars (should show error)

### Test 5: Token Persistence
- [ ] Close browser tab
- [ ] Reopen http://localhost:3000
- [ ] Should go directly to dashboard (token still valid)
- [ ] Clear localStorage and try again (should go to login)

## MongoDB Verification

### Check Created Database
```bash
mongosh
> use finance_tracker
> db.users.find()
```
- [ ] Should see registered users
- [ ] Passwords should be hashed (start with $2b$)
- [ ] Email should be unique

## Troubleshooting Checklist

If something doesn't work, check:

### Backend Issues
- [ ] Python 3.8+ installed: `python --version`
- [ ] Virtual environment activated: `(venv)` in prompt
- [ ] All requirements installed: `pip list | grep -E "Flask|pymongo|PyJWT|bcrypt"`
- [ ] MongoDB running: `mongod` or MongoDB Atlas connection active
- [ ] Port 5000 not in use: `lsof -i :5000`
- [ ] Backend .env file exists and configured
- [ ] Check backend console for error messages

### Frontend Issues
- [ ] Node.js installed: `node --version`
- [ ] npm packages installed: `node_modules` folder exists
- [ ] Port 3000 not in use: Check if another app using port 3000
- [ ] No JavaScript errors: Open browser DevTools (F12)
- [ ] Check Network tab for API responses
- [ ] Make sure backend is running before frontend

### MongoDB Issues
- [ ] MongoDB running: `mongod` command in terminal
- [ ] Correct URI in `.env`
- [ ] If using MongoDB Atlas:
  - [ ] Whitelist your IP address
  - [ ] Use correct username/password
  - [ ] Connection string format correct

### CORS Issues
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] CORS enabled in backend (should be by default)
- [ ] Check browser console for CORS errors

## After Successful Setup

### Files to Keep Open
- Terminal 1: Backend (Flask server)
- Terminal 2: Frontend (React server)
- Terminal 3: MongoDB (if running locally)
- Browser: http://localhost:3000

### Common Next Commands
```bash
# Restart backend (if needed)
Ctrl+C  # Stop server
python app.py  # Restart

# Restart frontend (if needed)
Ctrl+C  # Stop server
npm start  # Restart

# View backend logs
# Already visible in backend terminal

# View frontend logs
# Visible in frontend terminal and browser console
```

### Stop Everything When Done
```bash
# In each terminal
Ctrl+C

# Or kill processes:
# Windows: Find process in Task Manager
# macOS/Linux:
kill -9 <PID>
```

## Success Indicators

You'll know everything is working when:

✅ Backend terminal shows:
```
✓ Connected to MongoDB database: finance_tracker
 * Running on http://0.0.0.0:5000
```

✅ Frontend terminal shows:
```
Compiled successfully!
You can now view finance-tracker-frontend in the browser.
```

✅ Browser shows:
```
💰 Finance Tracker
Manage your finances efficiently
[Registration form visible]
```

✅ You can:
- Register a new user
- See dashboard with your name
- Logout
- Login with your credentials
- Access dashboard without logging in again

## Next Steps After Setup

1. **Explore the Code**
   - Review `backend/app.py` to understand the structure
   - Review `frontend/src/App.js` for routing
   - Check `frontend/src/pages/LoginPage.js` for UI

2. **Read Documentation**
   - `README.md` - Full project documentation
   - `QUICK_START.md` - Quick reference
   - `PROJECT_STRUCTURE.md` - Architecture details

3. **Plan Features**
   - Start with Transaction management
   - Then add Budget tracking
   - Finally add Reports

4. **Development**
   - Use DevTools for debugging
   - Check backend logs in terminal
   - Use MongoDB console for data inspection

## Support & Help

### Check These Files
1. `README.md` - Full documentation
2. `STARTUP.md` - Setup guide
3. `QUICK_START.md` - Common tasks
4. `PROJECT_STRUCTURE.md` - Architecture

### Debug Steps
1. Check browser console (F12)
2. Check backend terminal output
3. Verify MongoDB connection
4. Check .env files are configured
5. Ensure all dependencies installed

### Common Commands for Debugging
```bash
# Backend debugging
pip list  # Check installed packages
mongosh   # MongoDB shell
python -c "import flask; print(flask.__version__)"

# Frontend debugging
npm list  # Check installed packages
npm ls react-router-dom  # Check specific package

# Network debugging
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}'
```

---

**Status**: Ready to start development!
**Date**: December 3, 2025
**Time to complete**: ~15 minutes
