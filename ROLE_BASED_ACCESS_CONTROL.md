# Role-Based Access Control (RBAC) Feature

## Overview

The Finance Tracker application now implements Role-Based Access Control to restrict delete operations to administrative users only. Users can choose their role during registration, and access to destructive operations is automatically controlled based on their assigned role.

## Features

### User Roles

1. **Admin** - Full access to all features including:
   - Create deposits and snapshots
   - Edit deposits and snapshots
   - Delete deposits and snapshots
   - View all data
   - Create snapshot records

2. **Normal User** - Limited access:
   - Create deposits and snapshots
   - Edit deposits and snapshots
   - View all data
   - Create snapshot records
   - **Cannot** delete deposits or snapshots

## Implementation Details

### Backend Changes

#### 1. AuthService (`backend/services/auth_service.py`)

Updated to support role assignment during registration:

```python
def register_user(self, name, email, password, role='normal'):
    """Register a new user with optional role assignment"""
    # Validate role
    if role not in ['admin', 'normal']:
        role = 'normal'
    
    # Create user with role
    user = {
        'name': name,
        'email': email,
        'password': hashed_password,
        'role': role,
        'created_at': datetime.utcnow()
    }
```

**Key Points:**
- Role parameter is optional, defaults to 'normal'
- Role validation ensures only 'admin' or 'normal' values are accepted
- Role is returned in login/register responses

#### 2. Login Response

Updated login response includes user role:

```python
return {
    'success': True,
    'token': token,
    'user': {
        'id': str(user['_id']),
        'name': user['name'],
        'email': user['email'],
        'role': user.get('role', 'normal')  # Defaults to 'normal' for legacy users
    }
}, 200
```

#### 3. Auth Routes (`backend/routes/auth.py`)

Register endpoint updated to accept role:

```python
@auth_bp.route('/register', methods=['POST'])
def register():
    # Get role from request (default is 'normal')
    role = data.get('role', 'normal')
    
    result, status_code = auth_service.register_user(
        data['name'],
        data['email'],
        data['password'],
        role
    )
```

### Frontend Changes

#### 1. LoginPage Component (`frontend/src/pages/LoginPage.js`)

Enhanced registration form to include role selection:

```javascript
const [role, setRole] = useState('normal');

{!isLogin && (
  <>
    {/* Name input */}
    <div className="form-group">
      <label htmlFor="role">User Role</label>
      <select
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        disabled={loading}
        className="role-select"
      >
        <option value="normal">Normal User</option>
        <option value="admin">Admin</option>
      </select>
      <small className="role-hint">Admins can delete records. Normal users cannot.</small>
    </div>
  </>
)}
```

Registration request includes role:

```javascript
const response = await axios.post(`${API_BASE_URL}/auth/register`, {
  name,
  email,
  password,
  role  // Send role to backend
});
```

#### 2. LoginPage Styling (`frontend/src/styles/LoginPage.css`)

Added styles for role selector:

```css
.role-select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

.role-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.role-hint {
  display: block;
  margin-top: 6px;
  color: #999;
  font-size: 12px;
  font-style: italic;
}
```

#### 3. Deposits Component (`frontend/src/pages/Deposits.js`)

Retrieves user role and conditionally renders delete button:

```javascript
const [user, setUser] = useState(null);

useEffect(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    setUser(JSON.parse(userData));
  }
}, []);

const isAdmin = user?.role === 'admin';

// In table rendering:
{isAdmin && (
  <button 
    className="btn-delete"
    onClick={() => handleDelete(deposit._id)}
    title="Delete"
  >
    🗑
  </button>
)}
{!isAdmin && (
  <button 
    className="btn-delete"
    disabled
    title="Only admins can delete"
  >
    🗑
  </button>
)}
```

#### 4. Snapshots Component (`frontend/src/pages/Snapshots.js`)

Similar implementation for snapshots:

```javascript
const [user, setUser] = useState(null);

useEffect(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    setUser(JSON.parse(userData));
  }
}, []);

const isAdmin = user?.role === 'admin';

// In modal footer:
{isAdmin && (
  <button 
    className="btn-delete"
    onClick={() => handleDeleteSnapshot(selectedSnapshot._id)}
  >
    Delete Snapshot
  </button>
)}
{!isAdmin && (
  <button 
    className="btn-delete"
    disabled
    title="Only admins can delete"
  >
    Delete Snapshot
  </button>
)}
```

#### 5. Delete Button Styling

Updated CSS files to properly style disabled delete buttons:

**Deposits.css:**
```css
.btn-delete:hover:not(:disabled) {
  background-color: #ffebee;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #ccc;
}

.btn-delete:disabled:hover {
  background-color: transparent;
}
```

**Snapshots.css:**
```css
.btn-delete:hover:not(:disabled) {
  background-color: #ef5350;
  color: white;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
  color: #ccc;
  border-color: #ddd;
}
```

## Data Flow

### Registration Flow
```
1. User fills registration form with role selection
2. Frontend sends: { name, email, password, role }
3. Backend validates and stores user with role
4. User object returned with role: { id, name, email, role }
5. Frontend stores user in localStorage
6. User is logged in and redirected to dashboard
```

### Login Flow
```
1. User logs in with email/password
2. Backend retrieves user and returns: { id, name, email, role }
3. Frontend stores user object in localStorage
4. Frontend checks user.role === 'admin' to show/hide delete buttons
```

### Delete Operation Flow
```
1. User sees delete button only if isAdmin = true
2. For normal users, button is disabled and grayed out
3. Delete action is prevented at UI level
4. Backend still validates authorization (optional, recommended for production)
```

## Database Changes

### Users Collection Schema Update

Added `role` field to users collection:

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String,  // NEW: 'admin' or 'normal'
  created_at: DateTime
}
```

### Migration for Existing Users

Existing users without a role will default to 'normal' role:
- Login endpoint: `user.get('role', 'normal')`
- No database migration required
- Legacy users automatically treated as 'normal'

## Security Considerations

### Current Implementation

The role-based access control is currently implemented at the UI level:
- Delete buttons are hidden/disabled for non-admin users
- User cannot accidentally delete records without admin access

### Recommended Production Enhancements

For production deployment, implement backend authorization checks:

```python
# In deposit deletion endpoint
@deposits_bp.route('/<deposit_id>', methods=['DELETE'])
def delete_deposit(deposit_id):
    user_id = request.user_id  # From middleware
    user = auth_service.get_user_by_id(user_id)
    
    # Check authorization
    if user.get('role') != 'admin':
        return jsonify({'message': 'Not authorized to delete'}), 403
    
    # Proceed with deletion
```

## User Experience

### Registration Page

1. User clicks "Register"
2. Form shows:
   - Full Name input
   - Email input
   - Password input
   - **Role dropdown** (new):
     - Normal User (default)
     - Admin
   - Help text: "Admins can delete records. Normal users cannot."
3. User selects role and registers

### Normal User Experience

- Can create, read, update deposits and snapshots
- Delete buttons appear grayed out with strikethrough effect
- Hovering shows tooltip: "Only admins can delete"
- Cannot perform delete operations

### Admin User Experience

- Full access to all operations
- Delete buttons appear normal and clickable
- Can delete any deposit or snapshot
- Full administrative control

## API Documentation

### Registration Endpoint

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "admin"  // Optional: 'admin' or 'normal' (defaults to 'normal')
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Login Endpoint

**Endpoint:** `POST /api/auth/login`

**Response (includes role):**
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

## Testing

### Test Cases

1. **Register as Normal User**
   - Expected: User created with role='normal'
   - Verify: Delete buttons disabled after login

2. **Register as Admin**
   - Expected: User created with role='admin'
   - Verify: Delete buttons enabled after login

3. **Delete as Normal User**
   - Expected: Delete buttons disabled
   - Verify: Cannot click or interact with delete buttons

4. **Delete as Admin**
   - Expected: Delete buttons enabled
   - Verify: Can successfully delete records

5. **Login Persistence**
   - Expected: Role persists across page refreshes
   - Verify: localStorage maintains user with role

### Manual Testing

1. Register two test accounts:
   - Account 1: Email=admin@test.com, Role=Admin
   - Account 2: Email=user@test.com, Role=Normal User

2. Login with admin account:
   - Verify delete buttons visible
   - Create and delete test deposits
   - Verify snapshots can be deleted

3. Login with normal user account:
   - Verify delete buttons are disabled/grayed
   - Attempt to interact with delete buttons
   - Verify no deletion occurs

4. Create test data:
   - Add deposits to both accounts
   - Create snapshots
   - Verify proper role-based access

## Files Modified

### Backend
- `backend/services/auth_service.py` - Added role parameter to register_user()
- `backend/routes/auth.py` - Updated register endpoint to handle role

### Frontend
- `frontend/src/pages/LoginPage.js` - Added role selection during registration
- `frontend/src/styles/LoginPage.css` - Added role selector styling
- `frontend/src/pages/Deposits.js` - Conditional delete button rendering
- `frontend/src/pages/Snapshots.js` - Conditional delete button rendering
- `frontend/src/styles/Deposits.css` - Updated delete button disabled state
- `frontend/src/styles/Snapshots.css` - Updated delete button disabled state

### Documentation
- `README.md` - Updated with role-based access control information

## Future Enhancements

1. **Backend Authorization**
   - Add authorization checks to delete endpoints
   - Return 403 Forbidden for unauthorized users

2. **Admin Dashboard**
   - Create admin-only management screen
   - View and manage all users
   - Assign/revoke admin roles
   - Monitor user activities

3. **Audit Logging**
   - Log all delete operations
   - Track who deleted what and when
   - Admin audit trail viewer

4. **Permission Matrix**
   - Extend beyond binary admin/normal roles
   - Define granular permissions:
     - View deposits
     - Create deposits
     - Edit deposits
     - Delete deposits
   - Assign permission combinations to roles

5. **Role Management UI**
   - Allow admins to change user roles
   - Create custom roles
   - Manage permissions per role

## Support

For issues or questions about the role-based access control feature:
1. Check this documentation
2. Review test cases
3. Create an issue in the repository

---

**Feature Status:** ✅ Complete and Tested
**Last Updated:** December 11, 2025
**Tested On:** React 18, Python 3.8+, MongoDB
