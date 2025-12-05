# Deposits Feature - Quick Test Guide

## Setup

Before testing, ensure:
1. ✅ Backend is running on `http://localhost:5000`
2. ✅ Frontend is running on `http://localhost:3000`
3. ✅ MongoDB is running locally
4. ✅ You are logged in to the application

## Test Cases

### Test 1: Navigate to Deposits Page
**Steps:**
1. Open http://localhost:3000
2. Login with your credentials
3. Click "💰 Deposits" in the sidebar

**Expected Result:**
- Deposits page loads
- Shows summary cards (all zeros initially)
- Shows "Add Deposit" button
- Empty deposits list

---

### Test 2: Create a Deposit
**Steps:**
1. On Deposits page, click "+ Add Deposit"
2. Fill in the form with:
   - Investment Account Type: Fixed Deposit
   - Bank: HDFC Bank
   - Account Number: 10234567890
   - Account Holder: John Doe
   - Deposit Type: FD
   - Deposit Amount: 100000
   - Interest Rate: 7.5
   - Start Date: 2024-01-01
   - Maturity Date: 2025-01-01
   - Interest Amount: 7500
   - Maturity Amount: 107500
   - Amount Accumulated: 100000
   - Account Status: Active
   - Plan on Maturity: Reinvest
3. Click "Add Deposit"

**Expected Result:**
- Form closes
- Deposit appears in table
- Summary updates (shows 100000 in Total Deposits)

---

### Test 3: Create Multiple Deposits
**Steps:**
1. Click "+ Add Deposit" again
2. Fill in different bank details:
   - Bank: ICICI Bank
   - Account Number: 20345678901
   - Account Holder: Jane Doe
   - Deposit Amount: 50000
   - Interest Rate: 6.5
   - Interest Amount: 3250
   - Maturity Amount: 53250
3. Click "Add Deposit"

**Expected Result:**
- Second deposit appears in table
- Summary updates (shows 150000 in Total Deposits)
- Both deposits visible in list

---

### Test 4: View Summary Statistics
**Steps:**
1. Look at summary cards at top of page

**Expected Result:**
- Total Deposits: ₹150,000
- Amount Accumulated: ₹100,000 (or whatever you entered)
- Total Interest Earned: ₹10,750 (7500 + 3250)
- Maturity Amount: ₹160,750 (107500 + 53250)

---

### Test 5: Edit a Deposit
**Steps:**
1. Find a deposit in the table
2. Click the edit button (✎)
3. Change values:
   - Interest Rate: 8.0
   - Interest Amount: 8000
   - Amount Accumulated: 108000
4. Click "Update Deposit"

**Expected Result:**
- Form closes
- Table updates with new values
- Summary updates automatically

---

### Test 6: Change Account Status
**Steps:**
1. Click edit on a deposit
2. Change Account Status to "Matured"
3. Click "Update Deposit"

**Expected Result:**
- Deposit status badge changes to orange
- Row shows Matured status

---

### Test 7: Delete a Deposit
**Steps:**
1. Find a deposit in table
2. Click delete button (🗑)
3. Confirm deletion

**Expected Result:**
- Confirmation dialog appears
- Deposit is removed from table
- Summary updates (totals decrease)

---

### Test 8: Pagination
**Steps:**
1. Create 15+ deposits
2. Observe the table

**Expected Result:**
- Only 10 deposits shown per page
- Pagination buttons appear at bottom
- "Previous" button disabled on page 1
- "Next" button disabled on last page

---

### Test 9: Test Form Validation
**Steps:**
1. Click "+ Add Deposit"
2. Leave required fields empty
3. Try to submit

**Expected Result:**
- Browser shows required field warnings
- Cannot submit without filling required fields

---

### Test 10: Check Responsive Design
**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Resize to different screen sizes

**Expected Result:**
- Layout adapts to screen size
- Table scrolls horizontally on mobile
- Form stacks vertically
- All buttons are still clickable

---

## Testing with API (Using Postman/Curl)

### Get Auth Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"YourPassword123"}'
```

Copy the token from response.

### Create Deposit
```bash
curl -X POST http://localhost:5000/api/deposits \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "investment_account_type": "Fixed Deposit",
    "bank": "SBI",
    "account_number": "30456789012",
    "account_holder": "Test User",
    "deposit_type": "FD",
    "deposit_amount": 200000,
    "interest_rate": 8.0,
    "start_date": "2024-01-01",
    "maturity_date": "2025-01-01",
    "interest_amount": 16000,
    "maturity_amount": 216000,
    "amount_accumulated": 200000,
    "account_status": "Active"
  }'
```

### Get All Deposits
```bash
curl -X GET "http://localhost:5000/api/deposits?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Summary
```bash
curl -X GET http://localhost:5000/api/deposits/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Deposit
```bash
curl -X PUT http://localhost:5000/api/deposits/DEPOSIT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount_accumulated": 210000}'
```

### Delete Deposit
```bash
curl -X DELETE http://localhost:5000/api/deposits/DEPOSIT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Database Verification

### Check Deposits in MongoDB
```bash
# Open MongoDB shell
mongosh

# Use database
use finance_tracker

# Find all deposits for a user
db.deposits.find().pretty()

# Find deposits by bank
db.deposits.find({"bank": "HDFC Bank"}).pretty()

# Check deposit count
db.deposits.countDocuments()

# Get total deposit amount
db.deposits.aggregate([{
  $group: {
    _id: null,
    total: { $sum: "$deposit_amount" }
  }
}])
```

---

## Common Issues & Troubleshooting

### Issue: "Unauthorized" Error
**Solution:**
- Make sure you're logged in
- Check token in browser localStorage (F12 → Application → LocalStorage)
- Re-login if token expired

### Issue: Deposits not showing
**Solution:**
- Check browser console for errors (F12 → Console)
- Check network tab (F12 → Network) for API responses
- Verify backend is running
- Clear browser cache and refresh

### Issue: Form not submitting
**Solution:**
- Check all required fields are filled
- Check browser console for JavaScript errors
- Make sure all dates are in valid format
- Check that numbers are entered for amount fields

### Issue: Summary shows 0
**Solution:**
- Create at least one deposit
- Check MongoDB for data: `db.deposits.count()`
- Refresh page to reload summary
- Check user_id matches in database

### Issue: Cannot delete deposit
**Solution:**
- Confirm deletion in dialog box
- Check browser console for errors
- Verify deposit exists before deleting
- Try refreshing page and deleting again

---

## Performance Testing

### Test Data Volume
1. Create 100 deposits
2. Check page load time
3. Verify pagination handles large datasets
4. Check summary calculation performance

### Test Concurrent Operations
1. Open deposits page in multiple browser tabs
2. Create deposit in one tab
3. Verify other tabs update correctly

### Test Data Persistence
1. Create a deposit
2. Close browser
3. Reopen application and login
4. Verify deposit still exists

---

## Security Testing

### Test Authentication
1. Try accessing `/deposits` without login
   - Should redirect to login page
2. Try accessing with expired token
   - Should show authorization error

### Test Authorization
1. Create deposit with user A
2. Try to delete with different session
   - Should not be able to access user A's deposits

### Test Input Validation
1. Try submitting with SQL injection: `'; DROP TABLE deposits; --`
2. Try submitting with very large numbers
3. Try submitting with special characters
4. All should be handled safely

---

## Browser Compatibility

Test with:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---

## Final Verification Checklist

- [ ] Can create deposit
- [ ] Can read all deposits
- [ ] Can update deposit
- [ ] Can delete deposit
- [ ] Summary updates correctly
- [ ] Pagination works
- [ ] Responsive design works
- [ ] Error messages display
- [ ] Form validation works
- [ ] Authentication required
- [ ] Data persists in MongoDB
- [ ] Performance is acceptable

---

**Test Status**: ✅ Ready to Test
**Last Updated**: December 4, 2025
