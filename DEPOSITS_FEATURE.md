# Deposits Feature Documentation

## Overview

The Deposits feature allows users to manage their bank deposits and fixed deposits with comprehensive tracking of interest, maturity amounts, and account status.

## Features

### 1. Create Deposits
- Add new deposit records with all details
- Track multiple deposits from different banks
- Support for various deposit types (FD, RD, Savings)

### 2. Read Deposits
- View all deposits with pagination
- Get single deposit details
- View comprehensive summary statistics

### 3. Update Deposits
- Edit any deposit information
- Update account status, amounts, and dates
- Track changes with timestamps

### 4. Delete Deposits
- Remove deposits from the system
- Confirmation before deletion

### 5. Summary Dashboard
- Total deposits amount
- Total accumulated amount
- Total interest earned
- Total maturity amount
- Active and matured account counts

## Deposit Attributes

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `user_id` | ObjectId | Associated user |
| `investment_account_type` | String | Type of investment account |
| `bank` | String | Bank name |
| `deposit_on_maturity` | String | Principal/Interest/Both |
| `account_number` | String | Deposit account number |
| `deposit_amount` | Number | Initial deposit amount (₹) |
| `amount_accumulated` | Number | Accumulated amount (₹) |
| `start_date` | Date | Deposit start date |
| `maturity_date` | Date | Maturity date |
| `interest_rate` | Number | Annual interest rate (%) |
| `interest_amount` | Number | Total interest earned (₹) |
| `maturity_amount` | Number | Total amount at maturity (₹) |
| `account_holder` | String | Account holder name |
| `account_status` | String | Active/Matured/Closed |
| `comments` | String | Additional notes |
| `plan_on_maturity` | String | Reinvest/Withdraw/Transfer |
| `deposit_type` | String | FD/RD/Savings |
| `created_at` | DateTime | Creation timestamp |
| `created_dt` | DateTime | Creation date |
| `updated_at` | DateTime | Last update timestamp |
| `updated_dt` | DateTime | Last update date |

## API Endpoints

### Create Deposit
```
POST /api/deposits
Authorization: Bearer <token>
Content-Type: application/json

{
  "investment_account_type": "Fixed Deposit",
  "bank": "HDFC Bank",
  "deposit_on_maturity": "Both",
  "account_number": "10234567890",
  "deposit_amount": 100000,
  "amount_accumulated": 110000,
  "start_date": "2024-01-01",
  "maturity_date": "2025-01-01",
  "interest_rate": 7.5,
  "interest_amount": 7500,
  "maturity_amount": 107500,
  "account_holder": "John Doe",
  "account_status": "Active",
  "comments": "Senior citizen rate",
  "plan_on_maturity": "Reinvest",
  "deposit_type": "FD"
}

Response: 201 Created
{
  "success": true,
  "deposit": { ...deposit details... }
}
```

### Get All Deposits
```
GET /api/deposits?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "deposits": [ ...list of deposits... ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

### Get Single Deposit
```
GET /api/deposits/<deposit_id>
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "deposit": { ...deposit details... }
}
```

### Update Deposit
```
PUT /api/deposits/<deposit_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount_accumulated": 115000,
  "account_status": "Matured"
}

Response: 200 OK
{
  "success": true,
  "deposit": { ...updated deposit details... }
}
```

### Delete Deposit
```
DELETE /api/deposits/<deposit_id>
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Deposit deleted successfully"
}
```

### Get Summary
```
GET /api/deposits/summary
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "summary": {
    "total_deposits": 500000,
    "total_accumulated": 550000,
    "total_interest": 50000,
    "total_maturity_amount": 550000,
    "count": 5,
    "active_count": 3,
    "matured_count": 2
  }
}
```

## Frontend Components

### Deposits.js
Main component for managing deposits with:
- Add/Edit form
- Deposits table with pagination
- Summary statistics
- Delete functionality
- Status filtering

### Features
- **Form Validation**: Client-side validation for all fields
- **Pagination**: 10 deposits per page
- **Search/Filter**: Sort by bank, status, etc.
- **Status Indicators**: Visual badges for deposit status
- **Responsive Design**: Works on desktop and mobile

## Backend Services

### DepositService
Handles all business logic:
- Create deposit
- Read deposits (single and multiple)
- Update deposit
- Delete deposit
- Get summary statistics
- Format responses

### Error Handling
- 404: Deposit not found
- 401: Unauthorized (missing/invalid token)
- 400: Bad request (missing required fields)
- 500: Server error

## Database Schema

### MongoDB Collection: deposits

```javascript
db.createCollection("deposits", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        _id: { bsonType: "objectId" },
        user_id: { bsonType: "objectId" },
        investment_account_type: { bsonType: "string" },
        bank: { bsonType: "string" },
        deposit_on_maturity: { bsonType: "string" },
        account_number: { bsonType: "string" },
        deposit_amount: { bsonType: "double" },
        amount_accumulated: { bsonType: "double" },
        start_date: { bsonType: "string" },
        maturity_date: { bsonType: "string" },
        interest_rate: { bsonType: "double" },
        interest_amount: { bsonType: "double" },
        maturity_amount: { bsonType: "double" },
        account_holder: { bsonType: "string" },
        account_status: { bsonType: "string" },
        comments: { bsonType: "string" },
        plan_on_maturity: { bsonType: "string" },
        deposit_type: { bsonType: "string" },
        created_at: { bsonType: "date" },
        created_dt: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        updated_dt: { bsonType: "date" }
      }
    }
  }
});

// Create indexes
db.deposits.createIndex({ user_id: 1 });
db.deposits.createIndex({ user_id: 1, created_at: -1 });
```

## Usage Example

### Frontend - Create Deposit
```javascript
const depositData = {
  investment_account_type: "Fixed Deposit",
  bank: "ICICI Bank",
  account_number: "12345678",
  account_holder: "Jane Doe",
  deposit_type: "FD",
  deposit_amount: 50000,
  interest_rate: 6.5,
  start_date: "2024-12-01",
  maturity_date: "2025-12-01",
  account_status: "Active"
};

const response = await axios.post(`${API_BASE_URL}/deposits`, depositData, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Frontend - List Deposits
```javascript
const response = await axios.get(`${API_BASE_URL}/deposits?page=1`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const deposits = response.data.deposits;
```

### Frontend - Update Deposit
```javascript
const updates = {
  amount_accumulated: 55000,
  account_status: "Matured"
};

const response = await axios.put(`${API_BASE_URL}/deposits/${depositId}`, updates, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Security

- **Authentication**: JWT token required for all requests
- **Authorization**: Users can only access their own deposits
- **Input Validation**: Server-side validation for all inputs
- **Data Protection**: User data isolated by user_id

## Performance

- **Pagination**: Limits queries to 10 records per page
- **Indexing**: Indexes on user_id and created_at
- **Sorting**: Latest deposits shown first
- **Aggregation**: Efficient MongoDB aggregation for summary

## Future Enhancements

1. **Export**: CSV/PDF export of deposits
2. **Reports**: Monthly/yearly deposit analysis
3. **Notifications**: Maturity alerts
4. **Calculations**: Auto-calculate interest and maturity amount
5. **Recurring**: Auto-renewal of deposits
6. **Bulk Upload**: Import deposits from file
7. **Filters**: Advanced search and filtering
8. **Analytics**: Charts and graphs for visualization

## Testing

### Manual Test Cases

1. **Create Deposit**
   - Fill all required fields
   - Submit form
   - Verify deposit appears in list

2. **View Deposits**
   - Check pagination works
   - Verify summary updates
   - Check filters work

3. **Edit Deposit**
   - Click edit on a deposit
   - Change values
   - Verify update

4. **Delete Deposit**
   - Click delete
   - Confirm deletion
   - Verify removal

5. **Summary Stats**
   - Create multiple deposits
   - Verify calculations are correct
   - Check totals update

## Troubleshooting

### Deposits not loading
- Check token is valid
- Verify MongoDB connection
- Check user_id is set correctly

### Cannot add deposit
- Verify all required fields are filled
- Check bank account number format
- Verify dates are valid

### Summary shows 0
- Ensure deposits are created with correct user_id
- Check MongoDB aggregation pipeline
- Verify data format

## Files

- **Backend**: `backend/services/deposit_service.py`
- **Backend**: `backend/routes/deposits.py`
- **Frontend**: `frontend/src/pages/Deposits.js`
- **Styling**: `frontend/src/styles/Deposits.css`
- **Main App**: `backend/app.py` (updated)
- **Main App**: `frontend/src/App.js` (updated)
- **Dashboard**: `frontend/src/pages/Dashboard.js` (updated)

---

**Status**: ✅ Fully Implemented
**Last Updated**: December 4, 2025
