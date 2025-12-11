# Portfolio Snapshot - Quick Start Guide

## Overview
The Portfolio Snapshot feature captures a point-in-time snapshot of your entire investment portfolio. It automatically calculates the total value across all investment types and asset categories.

## Getting Started

### Step 1: Navigate to Snapshots
1. Log in to Finance Tracker
2. Click **Dashboard** in sidebar
3. Click **📸 Snapshots** button or link in sidebar

### Step 2: Create Your First Snapshot
1. Click the blue **"📸 Create Snapshot"** button
2. Confirm in the popup dialog
3. Wait for processing (usually < 1 second)
4. New snapshot appears in the grid

### Step 3: View Snapshot Details
1. Click on any snapshot card
2. Large modal opens showing:
   - Creation date and creator
   - All asset categories with values
   - Total portfolio value
   - Delete button at bottom

### Step 4: Manage Snapshots
- **Pagination**: Use Previous/Next buttons to browse snapshots
- **Delete**: Click "Delete Snapshot" button in detail view
- **Back**: Click card to close detail modal

## Snapshot Values Explained

### What Gets Calculated?

Your snapshot automatically sums values from all your deposits:

```
💰 Savings Account
   └─ All savings account balances

💎 Fixed Deposits (FD)
   └─ All regular FDs (excluding Emergency Fund)

🔄 Recurring Deposits (RD)
   └─ All recurring deposit values

🏦 PPF (Public Provident Fund)
   └─ All PPF account balances

👔 EPF (Employee Provident Fund)
   └─ All EPF account balances

🎯 NPS (National Pension Scheme)
   └─ All NPS account values

🚨 Emergency Fund
   └─ Fixed Deposits marked as "Emergency Fund"

📈 TOTAL
   └─ Sum of all above categories
```

### Asset Categories (Always Zero)
- Cash: 0.0
- Mutual Funds (MF): 0.0
- Stocks: 0.0
- Gold: 0.0
- Loans: 0.0

## How Emergency Fund Works

A deposit is counted as **Emergency Fund** when:

1. **Account Type**: Must be "Fixed Deposit"
2. **Comments Field**: Must contain "Emergency Fund"

### Example
If you create an FD deposit with:
- **Amount**: ₹30,000
- **Comments**: "Emergency Fund - 6 months expenses"

Then your snapshot will show:
- **Emergency Fund**: ₹30,000 ✅
- **FD Total**: Does NOT include this ₹30,000

## Quick Tips

### 💡 Best Practices

1. **Name Your Deposits**
   - Use clear descriptions in comments
   - Helps identify emergency fund later

2. **Regular Snapshots**
   - Create monthly to track growth
   - Compare snapshots to see changes

3. **Emergency Fund Naming**
   - Always use "Emergency Fund" in comments
   - System is case-insensitive (works with any case)

4. **Review Before Delete**
   - Snapshots are permanent once deleted
   - Cannot recover deleted snapshots

### ❌ Common Mistakes

- ❌ Forgetting to set comments for Emergency Fund
  - Solution: Add "Emergency Fund" to FD comments

- ❌ Using different FD account for emergency savings
  - Solution: Use FD type and mark in comments

- ❌ Expecting matured deposits in snapshot
  - Solution: Snapshots only include active deposits

## Snapshot Data Accuracy

### What's Included ✅
- All active deposits (not matured)
- Amount accumulated values
- Different investment types

### What's Excluded ❌
- Matured deposits
- Closed accounts
- Failed transactions

## Understanding the Display

### Grid View (Main List)
Each card shows:
```
📅 Created Date - Creator Name
├─ Cash: ₹0
├─ Savings: ₹50,000
├─ FD: ₹100,000
├─ RD: ₹25,000
└─ Emergency Fund: ₹30,000
─────────────────────
Total: ₹205,000
```

### Detail View (Click Card)
Full breakdown including:
- All 12 asset categories
- Individual values
- Creation metadata
- Emergency fund highlighted in red

## Creating Regular Snapshots

### Monthly Review
1. End of each month, create snapshot
2. Compare with previous month
3. Analyze changes in portfolio
4. Adjust investment strategy if needed

### Before Major Changes
1. Before adding new deposits
2. Before closing accounts
3. Before emergency fund use
4. Track before/after impact

## Data Privacy & Security

✅ **Your snapshots are private**
- Only you can view your snapshots
- No one else can access them
- Protected by authentication token

✅ **Data is immutable**
- Snapshots cannot be modified
- Only action is deletion (with confirmation)
- Ensures data integrity

✅ **Automatic calculation**
- No manual entry needed
- Based on your actual deposits
- Always accurate

## Troubleshooting

### "No snapshots yet" Message
**Problem**: Snapshots page shows empty state
**Solution**: Click "Create Snapshot" button to create first one

### Snapshot values seem wrong
**Problem**: Calculated amounts don't match expected
**Solutions**:
1. Check all deposits have `amount_accumulated` filled
2. Verify deposit status is "Active" (not Matured)
3. Review investment account types match categories
4. Check emergency fund comments contain "Emergency Fund"

### Can't create snapshot
**Problem**: Create button doesn't work
**Solutions**:
1. Verify you have active deposits
2. Check internet connection
3. Try refreshing page
4. Ensure token is valid (re-login if needed)

### Delete button missing
**Problem**: No delete option in modal
**Solution**: Delete button only appears in detail view modal (click snapshot card)

## Common Questions

**Q: How often should I create snapshots?**
A: As often as you want. Typically monthly for tracking growth.

**Q: Can I modify a snapshot?**
A: No. Snapshots are immutable. Delete and recreate if needed.

**Q: What happens to snapshots when deposits are updated?**
A: Nothing. Snapshots are frozen at creation time. New deposits don't affect old snapshots.

**Q: Is Emergency Fund value included in FD total?**
A: No. Emergency Fund is a separate category. The FD total excludes emergency amounts.

**Q: Can I export snapshots?**
A: Currently no. Export feature coming soon.

**Q: How far back can I view snapshots?**
A: All snapshots are permanently stored. Pagination shows 10 per page.

**Q: Are snapshots backed up?**
A: Yes. All data stored in MongoDB with automatic backups.

## Next Actions

### After Creating Snapshot:
1. ✅ Create your first snapshot
2. ✅ View the detail breakdown
3. ✅ Check calculations are correct
4. ✅ Set a monthly reminder to create snapshots
5. ✅ Review every month for growth tracking

### To Track Progress:
1. Create snapshots monthly
2. Compare with previous snapshots
3. Calculate growth percentage
4. Adjust investments based on goals
5. Use emergency fund wisely

## Support

### Need Help?
- Check the full documentation in `SNAPSHOT_FEATURE.md`
- Review Deposits page for managing individual investments
- Check Dashboard for overall portfolio overview

### Reporting Issues?
Include:
- When the issue occurred
- What you were trying to do
- Browser console errors (if any)
- Current deposits list

---

**Happy Portfolio Tracking! 📈**

For detailed technical information, see `SNAPSHOT_FEATURE.md`
