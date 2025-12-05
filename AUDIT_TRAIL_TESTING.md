# Audit Trail Testing Guide

## Overview
This guide will help you test the new audit trail functionality in the Deposits feature.

---

## Prerequisites

✅ Backend running on `http://localhost:5000`
✅ Frontend running on `http://localhost:3000`
✅ MongoDB running locally
✅ Valid user account (register if needed)

---

## Test Cases

### Test 1: Verify Audit Trail on New Deposit Creation

**Steps:**
1. Login to the application
2. Navigate to "💰 Deposits"
3. Click "+ Add Deposit"
4. Fill in the form with sample data:
   - Bank: "HDFC Bank"
   - Account Holder: "John Doe"
   - Deposit Amount: 100000
   - Interest Rate: 7.5
   - Start Date: Today's date
   - Maturity Date: 1 year from today
   - Account Status: Active
5. Click "Add Deposit"

**Expected Result:**
- ✅ Deposit is created successfully
- ✅ Table shows the new deposit
- ✅ "Created By" column shows your username
- ✅ "Updated By" column shows your username
- ✅ No CORS errors in console

**Browser Console Check:**
```
Open DevTools (F12) → Network tab
- Should see successful POST request to /api/deposits
- Status: 201 Created
- Response should include "createdBy": "Your Name"
```

---

### Test 2: Verify Audit Trail on Deposit Update

**Steps:**
1. From the deposits table, click the ✎ (edit) button on any deposit
2. Change the Interest Rate from 7.5% to 8.5%
3. Change Account Status from "Active" to "Matured"
4. Click "Update Deposit"

**Expected Result:**
- ✅ Deposit is updated successfully
- ✅ "Updated By" column still shows your username (the person who made the update)
- ✅ "Created By" column remains unchanged (shows original creator)
- ✅ Interest Rate and Status are updated

**Browser Console Check:**
```
Network tab → PUT request to /api/deposits/{id}
- Status: 200 OK
- Response should include updated "updatedBy": "Your Name"
```

---

### Test 3: Verify Column Display

**Steps:**
1. View the deposits table
2. Check that the new columns are visible:

**Expected Result:**
- ✅ Table has 10 columns in order:
  1. Bank
  2. Account Holder
  3. Deposit Amount
  4. Interest Rate
  5. Start Date
  6. Maturity Date
  7. Status
  8. Created By ← NEW
  9. Updated By ← NEW
  10. Actions

- ✅ User names in "Created By" and "Updated By" are displayed in purple color
- ✅ User names are clearly visible and readable

---

### Test 4: Verify Table Responsiveness

**Steps:**
1. Open the Deposits page in a desktop browser
2. Resize the browser window to simulate smaller screens
3. Observe the table behavior

**Expected Result:**
- ✅ Table becomes horizontally scrollable on smaller screens
- ✅ Header remains sticky (stays at top when scrolling down)
- ✅ All columns including new ones are accessible via horizontal scroll

**Test on Different Screen Sizes:**
- Desktop (1920x1080) - Table should fit without scrolling
- Tablet (768x1024) - Table should scroll horizontally
- Mobile (375x667) - Table should scroll horizontally

---

### Test 5: Verify API Response Structure

**Manual API Test using Browser DevTools:**

Open console and run:
```javascript
// Fetch a single deposit
fetch('http://localhost:5000/api/deposits', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
```

**Expected Response:**
```json
{
  "success": true,
  "deposits": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": "507f1f77bcf86cd799439012",
      "bank": "HDFC Bank",
      "account_holder": "John Doe",
      "deposit_amount": 100000,
      "interest_rate": 7.5,
      "start_date": "2025-12-04",
      "maturity_date": "2026-12-04",
      "account_status": "Active",
      "created_at": "2025-12-04T10:30:00.123456",
      "createdBy": "Your Name",
      "updated_at": "2025-12-04T10:30:00.123456",
      "updatedBy": "Your Name",
      ...
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

**Check:**
- ✅ Response includes `createdBy` field with username
- ✅ Response includes `updatedBy` field with username
- ✅ Response does NOT include `created_dt` or `updated_dt`
- ✅ Response includes `created_at` and `updated_at` as ISO timestamps

---

### Test 6: Verify CORS is Fixed

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "+ Add Deposit"
4. Create a new deposit
5. Watch the network requests

**Expected Result:**
- ✅ OPTIONS preflight request completes successfully
  - Status: 200 OK
  - Headers: Access-Control-Allow-* headers present
- ✅ POST request completes successfully
  - Status: 201 Created
- ✅ No CORS errors in Console tab
- ✅ No messages about "blocked by CORS policy"

**If you see CORS errors:**
```
FAILED: blocked by CORS policy
```
- Check that backend CORS headers are set correctly in app.py
- Restart backend server
- Check `@app.after_request` decorator is properly configured

---

### Test 7: Multiple Users Scenario (Optional)

**Steps:**
1. Create a second test user (register with different email)
2. Login with first user
3. Create a deposit (will be created by first user)
4. Logout
5. Login with second user
6. Update the first user's deposit
7. Check "Updated By" field

**Expected Result:**
- ✅ "Created By" shows first user's name (creator)
- ✅ "Updated By" shows second user's name (updater)
- ✅ Correctly tracks which user made the last modification

---

### Test 8: Verify Fallback Value

**Steps:**
1. If you have old deposits (without createdBy/updatedBy fields):
2. Check the frontend display

**Expected Result:**
- ✅ If `createdBy` is missing or null, displays "System"
- ✅ If `updatedBy` is missing or null, displays "System"

---

## Troubleshooting

### Issue: Still getting CORS errors
**Solution:**
1. Check backend is running: `python app.py` from `backend/` directory
2. Verify CORS configuration in `app.py`:
   ```python
   CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://localhost:3001'])
   ```
3. Restart backend server
4. Hard refresh frontend (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: "Created By" and "Updated By" showing "System"
**Solution:**
1. Check that user is properly logged in (check localStorage: `localStorage.getItem('token')`)
2. Check backend middleware is setting `request.user_name`
3. Check that user record exists in MongoDB with `name` field
4. Create a new deposit (old deposits won't have the audit info unless migrated)

### Issue: Table columns not showing
**Solution:**
1. Hard refresh the page (Ctrl+Shift+R)
2. Clear browser cache
3. Check frontend Deposits.js has the table header updates
4. Check Deposits.css is properly loaded

### Issue: "Updated By" not changing on edit
**Solution:**
1. Verify you're making changes to the deposit
2. Click "Update Deposit" button (not just any button)
3. Check network tab shows PUT request with 200 status
4. Refresh page to see updated value

---

## Monitoring

### Check MongoDB for Audit Trail

```javascript
// Connect to MongoDB with Mongo Shell or MongoDB Compass

// View a specific deposit with audit info
db.deposits.findOne({})

// Should show:
{
  _id: ObjectId(...),
  createdBy: "John Doe",
  updatedBy: "John Doe",
  created_at: ISODate(...),
  updated_at: ISODate(...),
  ...
}
```

### Check Backend Logs

When creating or updating a deposit, you should see in terminal:
```
127.0.0.1 - - [04/Dec/2025 10:30:00] "POST /api/deposits HTTP/1.1" 201 -
127.0.0.1 - - [04/Dec/2025 10:35:00] "PUT /api/deposits/... HTTP/1.1" 200 -
```

---

## Final Checklist

Before marking as complete:

- [ ] Can create deposits with "Created By" field populated
- [ ] Can update deposits with "Updated By" field updated
- [ ] Table displays both new columns
- [ ] Usernames are shown in purple/highlighted
- [ ] No CORS errors in console
- [ ] Table scrolls horizontally on small screens
- [ ] Fallback value "System" works if needed
- [ ] API returns correct JSON response
- [ ] Multiple users scenario works (if tested)

---

## Performance Notes

✅ **Table Performance**
- New columns don't significantly impact performance
- Horizontal scrolling is smooth
- Table rendering remains fast even with many deposits

✅ **API Performance**
- No additional database queries (user info fetched from JWT token)
- Response time should be similar to before
- No N+1 query issues

✅ **Memory**
- Frontend table cells are simple strings, minimal memory impact
- Backend stores usernames as strings, minimal storage impact

---

## Security Notes

✅ **Data Integrity**
- User names are retrieved from JWT token (verified)
- Cannot be manually set by client
- Server-side validation ensures correct user attribution

✅ **Privacy**
- Only shows usernames (not emails or other PII)
- Users can only see deposits they have access to
- Audit trail is tied to user_id for security

---

## Success Criteria

✅ All 8 test cases pass
✅ No console errors
✅ No CORS errors
✅ API returns correct response format
✅ Frontend displays audit trail information correctly
✅ Table is responsive and user-friendly

---

**Testing Status:** Ready for QA
**Test Environment:** Local (localhost)
**Test Date:** December 4, 2025
**Estimated Test Time:** 15-20 minutes
