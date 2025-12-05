# Deposits Filter Feature - Quick Reference

## 🚀 Quick Start

### For Users
1. Go to Deposits page
2. Click "▶ Show Filters" button
3. Select filter criteria from dropdowns
4. View filtered results instantly
5. Click "Clear Filters" to reset

### For Developers

#### Frontend Integration
```javascript
// States
const [showFilter, setShowFilter] = useState(false);
const [filters, setFilters] = useState({...});

// Handlers
const handleFilterChange = (e) => {...}
const clearFilters = () => {...}

// UI
<div className="filter-section">
  <button className="btn-filter-toggle">Show/Hide</button>
  <div className="filter-panel">... filters ...</div>
</div>
```

#### Backend Integration
```python
# New methods in DepositService
get_all_deposits_with_filters(user_id, page, limit, filters)
get_filter_options(user_id)

# New endpoint
GET /api/deposits/filter/options
```

---

## 📊 Filter Options

```
Investment Account Type:
├─ Savings Account
├─ Current Account
├─ Money Market
└─ Certificate of Deposit

Bank: (Dynamic)
├─ HDFC Bank
├─ ICICI Bank
├─ SBI
├─ Axis Bank
└─ Kotak Mahindra

Account Status:
├─ Active
├─ Matured
└─ Closed

Account Holder: (Dynamic)
├─ John Doe
├─ Jane Smith
└─ ... (populated from deposits)

Start Date: [Date Picker]
Maturity Date: [Date Picker]
```

---

## 🔗 API Reference

### GET /api/deposits
**With Filters:**
```
?bank=HDFC Bank
&account_status=Active
&account_holder=John Doe
&start_date=2025-01-01
&maturity_date=2026-12-31
```

### GET /api/deposits/filter/options
**Response:**
```json
{
  "banks": [...],
  "account_types": [...],
  "account_holders": [...]
}
```

---

## 🎨 CSS Classes

```css
.filter-section          /* Main container */
.btn-filter-toggle       /* Toggle button */
.filter-active-badge     /* Active indicator dot */
.filter-panel            /* Filter panel */
.filter-grid             /* 6-column grid */
.filter-group            /* Individual filter */
.btn-clear-filters       /* Clear button */
```

---

## 🔄 State Flow

```
User Input
    ↓
handleFilterChange()
    ↓
setFilters()
    ↓
useEffect (filters dependency)
    ↓
fetchDeposits()
    ↓
API Call with filter params
    ↓
Database Query
    ↓
Return Results
    ↓
Update Table
```

---

## ⚡ Performance Tips

✅ **Database Indexing**
```javascript
db.deposits.createIndex({ user_id: 1, bank: 1 })
db.deposits.createIndex({ user_id: 1, account_status: 1 })
```

✅ **Query Optimization**
- Server-side filtering
- Pagination (10 items/page)
- Efficient distinct() for options

✅ **Frontend Optimization**
- Memoized filter options
- Lazy load filter panel
- Virtual scrolling for large tables

---

## 🧪 Test Cases

| Test | Expected | Pass |
|------|----------|------|
| Toggle filters | Panel opens/closes | ✓ |
| Select bank | Table filters by bank | ✓ |
| Select status | Table filters by status | ✓ |
| Date range | Table filters by dates | ✓ |
| Multiple filters | Table shows AND results | ✓ |
| Clear filters | All reset, show all | ✓ |
| Active badge | Shows when filter on | ✓ |
| Responsive | Grid collapses mobile | ✓ |

---

## 📝 Usage Examples

### Example 1: Find Active Deposits
```javascript
// Frontend
filters = { account_status: 'Active' }

// API Call
GET /api/deposits?account_status=Active

// MongoDB Query
{ user_id: ObjectId(...), account_status: 'Active' }
```

### Example 2: Find HDFC Active Deposits
```javascript
// Frontend
filters = { 
  bank: 'HDFC Bank',
  account_status: 'Active'
}

// API Call
GET /api/deposits?bank=HDFC Bank&account_status=Active

// MongoDB Query
{
  user_id: ObjectId(...),
  bank: 'HDFC Bank',
  account_status: 'Active'
}
```

### Example 3: Find Recent Deposits
```javascript
// Frontend
filters = { start_date: '2025-01-01' }

// API Call
GET /api/deposits?start_date=2025-01-01

// MongoDB Query
{
  user_id: ObjectId(...),
  start_date: { $gte: '2025-01-01' }
}
```

---

## 🐛 Troubleshooting

### Issue: Filters not working
**Solution:**
1. Check backend is running
2. Verify filter params in URL
3. Check MongoDB connection
4. Look for console errors

### Issue: Dropdowns empty
**Solution:**
1. Ensure user has deposits
2. Check /filter/options endpoint
3. Verify fallback options used
4. Check network tab for API errors

### Issue: Slow filtering
**Solution:**
1. Add database indexes
2. Check large result sets
3. Verify pagination works
4. Profile MongoDB queries

### Issue: Filters not persisting
**Solution:**
1. Check filter state updates
2. Verify useEffect dependency
3. Check localStorage (if needed)
4. Review URL params

---

## 📚 Related Documentation

- `DEPOSITS_FILTER_GUIDE.md` - Full guide
- `FILTER_IMPLEMENTATION_SUMMARY.md` - Summary
- `DEPOSITS_FEATURE.md` - Feature overview
- `AUDIT_TRAIL_UPDATE.md` - Audit info

---

## 🎯 Key Points

✅ **6 Filters Available**
- Investment Account Type
- Bank
- Account Status
- Account Holder
- Start Date
- Maturity Date

✅ **3 Filter Types**
- Dynamic dropdowns (2)
- Fixed dropdowns (2)
- Date inputs (2)

✅ **Features**
- Toggle show/hide
- Active indicator
- Clear all button
- Responsive design

✅ **Performance**
- Server-side filtering
- Efficient queries
- Pagination support

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review related documentation
3. Check console for errors
4. Verify API endpoints
5. Test with sample data

---

**Last Updated:** December 4, 2025
**Status:** Production Ready ✅
