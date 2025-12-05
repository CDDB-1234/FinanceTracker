# Finance Tracker - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  http://localhost:3000                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  React Application (SPA)                          │  │  │
│  │  │  ┌────────────────────────────────────────────┐   │  │  │
│  │  │  │  Router                                   │   │  │  │
│  │  │  │  ├─ / → Dashboard (if authenticated)      │   │  │  │
│  │  │  │  └─ /login → Login/Register Page          │   │  │  │
│  │  │  └────────────────────────────────────────────┘   │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌────────────────────────────────────────────┐   │  │  │
│  │  │  │  Pages                                     │   │  │  │
│  │  │  │  ├─ LoginPage.js                          │   │  │  │
│  │  │  │  │  ├─ Register Form                      │   │  │  │
│  │  │  │  │  └─ Login Form                         │   │  │  │
│  │  │  │  │                                        │   │  │  │
│  │  │  │  └─ Dashboard.js                          │   │  │  │
│  │  │  │     ├─ User Greeting                      │   │  │  │
│  │  │  │     └─ Logout Button                      │   │  │  │
│  │  │  └────────────────────────────────────────────┘   │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌────────────────────────────────────────────┐   │  │  │
│  │  │  │  API Client (Axios)                       │   │  │  │
│  │  │  │  ├─ Token Management                      │   │  │  │
│  │  │  │  ├─ API Base URL: localhost:5000/api      │   │  │  │
│  │  │  │  └─ Auth Methods                          │   │  │  │
│  │  │  │     ├─ register()                         │   │  │  │
│  │  │  │     ├─ login()                            │   │  │  │
│  │  │  │     └─ verify()                           │   │  │  │
│  │  │  └────────────────────────────────────────────┘   │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌────────────────────────────────────────────┐   │  │  │
│  │  │  │  LocalStorage                             │   │  │  │
│  │  │  │  ├─ token (JWT)                           │   │  │  │
│  │  │  │  └─ user (JSON)                           │   │  │  │
│  │  │  └────────────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────┘
                                   │
                    HTTP/CORS over Network
                                   │
┌──────────────────────────────────▼──────────────────────────────┐
│                    BACKEND SERVER                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  http://localhost:5000                                   │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Flask Application (app.py)                        │  │  │
│  │  │  ├─ CORS Enabled                                  │  │  │
│  │  │  ├─ Error Handlers                                │  │  │
│  │  │  └─ Route Registration                            │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  API Routes (/api)                                 │  │  │
│  │  │  └─ /auth (routes/auth.py)                         │  │  │
│  │  │     ├─ POST /register                              │  │  │
│  │  │     │  ├─ Validate input                           │  │  │
│  │  │     │  ├─ Check email unique                       │  │  │
│  │  │     │  ├─ Hash password                            │  │  │
│  │  │     │  ├─ Create user                              │  │  │
│  │  │     │  └─ Return token + user                      │  │  │
│  │  │     │                                              │  │  │
│  │  │     ├─ POST /login                                 │  │  │
│  │  │     │  ├─ Find user by email                       │  │  │
│  │  │     │  ├─ Verify password                          │  │  │
│  │  │     │  ├─ Generate token                           │  │  │
│  │  │     │  └─ Return token + user                      │  │  │
│  │  │     │                                              │  │  │
│  │  │     └─ GET /verify (protected)                     │  │  │
│  │  │        ├─ Check token (middleware)                 │  │  │
│  │  │        ├─ Get user by ID                           │  │  │
│  │  │        └─ Return user data                         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Services (services/auth_service.py)              │  │  │
│  │  │  ├─ hash_password()                               │  │  │
│  │  │  │  └─ bcrypt hashing                             │  │  │
│  │  │  │                                                │  │  │
│  │  │  ├─ verify_password()                             │  │  │
│  │  │  │  └─ bcrypt comparison                          │  │  │
│  │  │  │                                                │  │  │
│  │  │  ├─ generate_token()                              │  │  │
│  │  │  │  └─ JWT encoding                               │  │  │
│  │  │  │                                                │  │  │
│  │  │  ├─ verify_token()                                │  │  │
│  │  │  │  └─ JWT decoding                               │  │  │
│  │  │  │                                                │  │  │
│  │  │  ├─ register_user()                               │  │  │
│  │  │  │  └─ Create new user                            │  │  │
│  │  │  │                                                │  │  │
│  │  │  └─ login_user()                                  │  │  │
│  │  │     └─ Authenticate user                          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Middleware (middleware/auth_middleware.py)        │  │  │
│  │  │  └─ token_required()                               │  │  │
│  │  │     ├─ Extract token from header                   │  │  │
│  │  │     ├─ Verify JWT signature                        │  │  │
│  │  │     ├─ Extract user_id from token                  │  │  │
│  │  │     └─ Attach user_id to request                   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────┘
                                   │
                      PyMongo Driver / Network
                                   │
┌──────────────────────────────────▼──────────────────────────────┐
│                        MONGODB DATABASE                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  finance_tracker (Database)                             │  │
│  │  ├─ users (Collection)                                  │  │
│  │  │  ├─ _id: ObjectId                                    │  │
│  │  │  ├─ name: String                                     │  │
│  │  │  ├─ email: String (unique index)                    │  │
│  │  │  ├─ password: String (bcrypt)                        │  │
│  │  │  └─ created_at: DateTime                             │  │
│  │  │                                                       │  │
│  │  └─ transactions (Collection - for future)              │  │
│  │     ├─ _id: ObjectId                                    │  │
│  │     ├─ user_id: ObjectId                                │  │
│  │     ├─ amount: Number                                   │  │
│  │     ├─ category: String                                 │  │
│  │     ├─ type: String (income/expense)                    │  │
│  │     └─ created_at: DateTime                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Registration Flow
```
┌──────────────┐
│  User Input  │
│  Register    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Frontend Validation      │
│ - Email format           │
│ - Password min 6 chars   │
│ - Name required          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ API Request              │
│ POST /api/auth/register  │
│ {name, email, password}  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Backend Input Validation │
│ - Check all fields       │
│ - Validate email format  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Check Email Uniqueness   │
│ Query: {email: email}    │
└──────┬───────────────────┘
       │
    Yes?
    ├─ No ──▶ Continue
    │
    └─ Yes ──▶ Error 409 (User exists)
               └──▶ Return to frontend
       │
       ▼
┌──────────────────────────┐
│ Hash Password            │
│ bcrypt.hashpw()          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Create User Document     │
│ {name, email, password}  │
│ users_collection.insert()│
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Generate JWT Token       │
│ jwt.encode()             │
│ payload: {user_id}       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Return Response 201      │
│ {token, user}            │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Store in localStorage    │
│ - token                  │
│ - user                   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Redirect to Dashboard    │
│ /dashboard               │
└──────────────────────────┘
```

### Login Flow
```
┌──────────────┐
│  User Input  │
│  Login       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Frontend Validation      │
│ - Email required         │
│ - Password required      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ API Request              │
│ POST /api/auth/login     │
│ {email, password}        │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Find User by Email       │
│ Query: {email: email}    │
└──────┬───────────────────┘
       │
    Found?
    ├─ No  ──▶ Error 401 (Invalid credentials)
    │         └──▶ Return to frontend
    │
    └─ Yes ──▶ Continue
       │
       ▼
┌──────────────────────────┐
│ Verify Password          │
│ bcrypt.checkpw()         │
└──────┬───────────────────┘
       │
    Valid?
    ├─ No  ──▶ Error 401 (Invalid credentials)
    │         └──▶ Return to frontend
    │
    └─ Yes ──▶ Continue
       │
       ▼
┌──────────────────────────┐
│ Generate JWT Token       │
│ jwt.encode()             │
│ payload: {user_id}       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Return Response 200      │
│ {token, user}            │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Store in localStorage    │
│ - token                  │
│ - user                   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Redirect to Dashboard    │
│ /dashboard               │
└──────────────────────────┘
```

## Authentication Flow

```
CLIENT SIDE                          SERVER SIDE

┌──────────────┐                     ┌──────────────┐
│   Registers  │─────Request────────▶│   Validates  │
│   or Logins  │                     │              │
└──────────────┘                     └──────┬───────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │ Hash/Verify  │
                                    │   Password   │
                                    └──────┬───────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │   Generate   │
                                    │  JWT Token   │
                                    └──────┬───────┘
                                            │
┌──────────────┐                     ┌─────▼───────┐
│   Receives   │◀─────Response───────│   Returns   │
│   Token      │                     │    Token    │
└──────┬───────┘                     └──────────────┘
       │
       ▼
┌──────────────┐
│  Store in    │
│ localStorage │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐          ┌──────────────┐
│ All API Requests        │──Token──▶│   Middleware │
│ Include Token in Header │          │   Validates  │
│ Authorization: Bearer.. │          │    Token     │
└──────────────────────────┘          └──────┬───────┘
                                             │
                                      Valid?
                                      ├─ Yes ──▶ Process Request
                                      │
                                      └─ No  ──▶ Error 401
```

## Component Interaction

```
┌─────────────────────────────────────────────────────┐
│                  App.js (Router)                    │
│  ┌──────────────────────────────────────────────┐   │
│  │  Checks Token in localStorage               │   │
│  │  ├─ Token? ──▶ Redirect to /dashboard       │   │
│  │  └─ No Token? ──▶ Redirect to /login        │   │
│  └────────────────┬─────────────────────────────┘   │
│                   │                                 │
│      ┌────────────┴─────────────┐                   │
│      │                          │                   │
│      ▼                          ▼                   │
│  ┌────────────┐          ┌────────────┐             │
│  │ LoginPage  │          │ Dashboard  │             │
│  │            │          │            │             │
│  │ ┌────────┐ │          │ ┌────────┐ │             │
│  │ │Register│ │          │ │Greeting│ │             │
│  │ │ Form   │ │          │ │+ Logout│ │             │
│  │ └────────┘ │          │ └────────┘ │             │
│  │            │          │            │             │
│  │ ┌────────┐ │          │            │             │
│  │ │ Login  │ │          │            │             │
│  │ │ Form   │ │          │            │             │
│  │ └────┬───┘ │          │            │             │
│  └─────┼──────┘          └──────┬─────┘             │
│        │                        │                   │
│        ▼                        ▼                   │
│   ┌────────────────────────────────┐               │
│   │  api/client.js (API Layer)     │               │
│   │                                │               │
│   │  Methods:                      │               │
│   │  - auth.register()             │               │
│   │  - auth.login()                │               │
│   │  - auth.verify()               │               │
│   │                                │               │
│   │  Features:                     │               │
│   │  - Token management            │               │
│   │  - Error handling              │               │
│   │  - Base URL setup              │               │
│   └────────┬─────────────────────┘               │
└────────────┼──────────────────────────────────────┘
             │
             │ HTTP/CORS
             │
     ┌───────▼────────┐
     │  Backend API   │
     │ (routes/auth)  │
     └────────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────────────┐
│          SECURITY MECHANISMS                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. PASSWORD SECURITY                           │
│     ┌─ Input: Plain text password                │
│     └─ bcrypt.hashpw() ─▶ Salted hash stored    │
│                                                  │
│  2. JWT TOKEN SECURITY                          │
│     ┌─ Payload: {user_id, iat}                  │
│     ├─ Signature: HS256(payload, SECRET_KEY)    │
│     └─ Stored: localStorage (XSS vulnerable)    │
│                                                  │
│  3. REQUEST SECURITY                            │
│     ┌─ Header: Authorization: Bearer <token>    │
│     ├─ Middleware: Verify token signature       │
│     └─ Extract: user_id from payload            │
│                                                  │
│  4. DATABASE SECURITY                           │
│     ┌─ Email: Unique index prevents duplicates  │
│     ├─ Password: Never stored plain text        │
│     └─ User_id: ObjectId (not sequential)       │
│                                                  │
│  5. API SECURITY                                │
│     ┌─ CORS: Restricted to localhost            │
│     ├─ Input: Validated on both sides           │
│     └─ Errors: No sensitive info in messages    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

This architecture supports:
- ✅ Scalability (stateless JWT auth)
- ✅ Security (password hashing, token validation)
- ✅ Maintainability (clear separation of concerns)
- ✅ Extensibility (easy to add new features)
