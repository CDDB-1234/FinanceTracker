# Portfolio Snapshot Feature - Documentation

## Overview

The Portfolio Snapshot feature allows users to capture a point-in-time summary of their entire financial portfolio. Each snapshot records the accumulated amounts across different investment types and asset categories.

## Features

### Create Snapshot
- Capture current portfolio values at any point in time
- Automatic calculation based on active deposits data
- Records who created the snapshot and when
- Excludes matured deposits from calculations

### View Snapshots
- List all snapshots in a responsive grid layout
- Quick summary view showing top asset categories
- Pagination support for managing multiple snapshots
- Click any snapshot to view detailed breakdown

### Delete Snapshot
- Remove snapshots from history
- Confirmation required before deletion

## Snapshot Attributes

Each snapshot contains the following calculated fields:

### Asset Categories
1. **Cash** - Always 0.0
2. **Savings** - Sum of all Savings Account `amount_accumulated`
3. **FD (Fixed Deposits)** - Sum of FD `amount_accumulated` (excluding Emergency Fund)
4. **RD (Recurring Deposits)** - Sum of RD `amount_accumulated`
5. **PPF** - Sum of PPF `amount_accumulated`
6. **EPF** - Sum of EPF `amount_accumulated`
7. **NPS** - Sum of NPS `amount_accumulated`
8. **MF (Mutual Funds)** - Always 0.0
9. **Stocks** - Always 0.0
10. **Gold** - Always 0.0
11. **Loans** - Always 0.0
12. **Emergency Fund** - Sum of FD `amount_accumulated` where comments contain "Emergency Fund"

### Metadata
- **TOTAL** - Sum of all asset categories
- **createdAt** - Timestamp when snapshot was created
- **createdBy** - Name of user who created the snapshot
- **_id** - Unique MongoDB ObjectId

## Calculation Logic

### Emergency Fund Detection
A deposit is classified as Emergency Fund if:
- Investment Account Type = "Fixed Deposit"
- Comments field contains "Emergency Fund" (case-insensitive)

### Amount Used
- Uses `amount_accumulated` field from deposits
- Excludes deposits with `account_status` = "Matured"
- Performs client-side summation based on deposit type

### Example Calculation

```
Given Deposits:
1. Savings Account: ₹50,000
2. FD (Regular): ₹100,000
3. FD (Emergency): ₹30,000 (comments: "Emergency Fund")
4. PPF: ₹20,000

Snapshot Values:
- Cash: ₹0
- Savings: ₹50,000
- FD: ₹100,000
- RD: ₹0
- PPF: ₹20,000
- Emergency Fund: ₹30,000
- TOTAL: ₹200,000
```

## Backend Implementation

### Files Created

#### `/backend/services/snapshot_service.py`
Main service class for snapshot operations:

```python
class SnapshotService:
    def create_snapshot(user_id, user_name=None)
    def get_snapshots(user_id, limit=50, skip=0)
    def get_snapshot(user_id, snapshot_id)
    def delete_snapshot(user_id, snapshot_id)
```

**Methods:**
- `create_snapshot()` - Creates new snapshot with calculations
- `get_snapshots()` - Retrieves all snapshots with pagination
- `get_snapshot()` - Retrieves single snapshot
- `delete_snapshot()` - Deletes snapshot
- `_format_snapshot()` - Formats snapshot for API response

#### `/backend/routes/snapshots.py`
REST API endpoints for snapshot operations:

```
POST   /api/snapshots              - Create snapshot
GET    /api/snapshots              - List snapshots
GET    /api/snapshots/<id>         - Get snapshot detail
DELETE /api/snapshots/<id>         - Delete snapshot
```

**All endpoints require:**
- Bearer token in Authorization header
- User context from middleware

### Database Schema

**MongoDB Collection: `snapshots`**

```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  cash: Number,
  savings: Number,
  fd: Number,
  rd: Number,
  ppf: Number,
  epf: Number,
  nps: Number,
  mf: Number,
  stocks: Number,
  gold: Number,
  loans: Number,
  emergency_fund: Number,
  total: Number,
  createdAt: Date,
  createdBy: String
}
```

### Token Middleware Integration

Updated `app.py` middleware to protect snapshot routes:

```python
if request.path.startswith('/api/snapshots'):
    # Token verification
    # User context extraction
```

## Frontend Implementation

### Files Created

#### `/frontend/src/api/snapshotApi.js`
Axios-based API client for snapshot operations:

```javascript
snapshotApi.createSnapshot(token)
snapshotApi.getSnapshots(token, limit, skip)
snapshotApi.getSnapshot(token, snapshotId)
snapshotApi.deleteSnapshot(token, snapshotId)
```

#### `/frontend/src/pages/Snapshots.js`
Main React component for snapshot management:

**State Management:**
- `snapshots` - Array of snapshots
- `selectedSnapshot` - Currently selected snapshot for detail view
- `loading` - Loading state
- `error` - Error messages
- `showCreateModal` - Create snapshot modal visibility
- `showDetailModal` - Detail view modal visibility
- `page` - Current pagination page

**Features:**
- Grid view of snapshots (responsive layout)
- Pagination for snapshot list
- Create new snapshot with confirmation
- View detailed snapshot breakdown
- Delete snapshot with confirmation
- Currency formatting (INR)
- Date formatting (local timezone)

#### `/frontend/src/styles/Snapshots.css`
Comprehensive styling for snapshot page:

**Key Classes:**
- `.snapshots-container` - Main container
- `.snapshots-header` - Top header with create button
- `.snapshots-grid` - Responsive grid layout
- `.snapshot-card` - Individual snapshot card
- `.modal-large` - Large detail modal
- `.modal-overlay` - Modal backdrop
- `.detail-total` - Total amount display

**Responsive Design:**
- Mobile: Single column layout
- Tablet: 2 column layout
- Desktop: 3+ column layout

### Integration Points

**App.js Updates:**
```javascript
import Snapshots from './pages/Snapshots';

// Added route
<Route 
  path="/snapshots" 
  element={isAuthenticated ? <Snapshots /> : <Navigate to="/login" />} 
/>
```

**Dashboard.js Updates:**
- Added Snapshots navigation button in sidebar
- Added quick link card for snapshots

## API Endpoints

### Create Snapshot
```
POST /api/snapshots
Authorization: Bearer <token>
Content-Type: application/json

Response:
{
  "success": true,
  "message": "Snapshot created successfully",
  "snapshot": { ... }
}
```

### List Snapshots
```
GET /api/snapshots?limit=50&skip=0
Authorization: Bearer <token>

Response:
{
  "success": true,
  "snapshots": [ ... ],
  "total": 150,
  "limit": 50,
  "skip": 0
}
```

### Get Snapshot Detail
```
GET /api/snapshots/<snapshot_id>
Authorization: Bearer <token>

Response:
{
  "success": true,
  "snapshot": { ... }
}
```

### Delete Snapshot
```
DELETE /api/snapshots/<snapshot_id>
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Snapshot deleted successfully"
}
```

## User Workflow

### Creating a Snapshot

1. Navigate to Snapshots page from Dashboard
2. Click "📸 Create Snapshot" button
3. Confirm creation in modal
4. System calculates all values based on current deposits
5. Snapshot appears in the grid

### Viewing Snapshot Details

1. Click on any snapshot card
2. Detail modal opens showing:
   - Creation timestamp
   - Creator name
   - All asset categories with values
   - Total portfolio value
   - Emergency fund highlight

### Managing Snapshots

1. Use pagination to navigate through snapshots
2. Each card shows preview of key values
3. Delete snapshots individually from detail view
4. Snapshots are immutable after creation

## Technical Details

### Calculation Performance

- Aggregation pipeline used for filtering active deposits
- Single pass through deposit collection
- All calculations in memory (small dataset)
- No real-time indexing required

### Data Integrity

- Snapshots are immutable after creation
- Cannot modify snapshot values
- Only deletion allowed (with confirmation)
- User isolation via user_id

### Security Considerations

- All endpoints require valid JWT token
- User can only access own snapshots
- Token middleware validates requests
- Request.user_id used for filtering

## Error Handling

### Common Errors

**401 Unauthorized**
- Missing or invalid token
- Solution: Re-login

**404 Not Found**
- Snapshot doesn't exist or belongs to different user
- Solution: Verify snapshot ID

**500 Server Error**
- Database connection issue
- Solution: Check backend logs

## Future Enhancements

1. **Export Snapshots**
   - CSV export functionality
   - PDF report generation

2. **Comparison**
   - Compare two snapshots side-by-side
   - Show growth/decline percentages

3. **Visualization**
   - Charts and graphs for portfolio composition
   - Trend analysis over time

4. **Scheduling**
   - Automatic snapshot creation on schedule
   - Daily/weekly/monthly snapshots

5. **Alerts**
   - Notify on significant changes
   - Threshold-based alerts

## Testing Checklist

- [ ] Create snapshot with various deposit types
- [ ] Verify calculations with manual math
- [ ] Test emergency fund detection
- [ ] Verify matured deposits excluded
- [ ] Test pagination
- [ ] Test delete with confirmation
- [ ] Test error handling
- [ ] Verify token validation
- [ ] Test responsive design on mobile
- [ ] Test data persistence in database

## Dependencies

### Backend
- PyMongo 4.6.0 (MongoDB client)
- Flask 3.0.0 (Web framework)
- Python datetime (Timestamp handling)

### Frontend
- React 18 (UI framework)
- Axios (HTTP client)
- React Router 6 (Navigation)
- CSS3 (Styling)

## File Structure

```
FinanceTracker/
├── backend/
│   ├── services/
│   │   └── snapshot_service.py      (NEW)
│   └── routes/
│       └── snapshots.py             (NEW)
├── frontend/
│   └── src/
│       ├── api/
│       │   └── snapshotApi.js       (NEW)
│       ├── pages/
│       │   └── Snapshots.js         (NEW)
│       └── styles/
│           └── Snapshots.css        (NEW)
```

## Configuration

No additional configuration required. The feature uses:
- Existing MongoDB connection from `app.py`
- Existing JWT token validation
- Existing CORS configuration

## Deployment Notes

1. Ensure `snapshots` collection is created in MongoDB
2. No migrations needed (schema-free MongoDB)
3. Update frontend environment variables if needed
4. Restart Flask backend to register new routes
5. Clear browser cache for new frontend code

## Support & Troubleshooting

### Snapshot not created
- Verify user has deposits in database
- Check token validity
- Review server logs

### Empty snapshot values
- Ensure deposits have `amount_accumulated` values
- Verify investment account types match expected values
- Check deposit account_status is not "Matured"

### Emergency fund not detected
- Verify comments field contains exact text "Emergency Fund"
- Check deposit type is "Fixed Deposit"
- Case-insensitive matching used
