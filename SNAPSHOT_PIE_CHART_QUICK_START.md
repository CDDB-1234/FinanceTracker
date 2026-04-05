# Snapshot Pie Chart - Quick Start Guide

## 🎯 What's New
A pie chart visualization has been added to display your portfolio composition in the Snapshots detail view.

## 📊 Accessing the Pie Chart

### Step 1: Navigate to Portfolio Snapshots
1. Click on **Snapshots** from the navigation menu or dashboard
2. You'll see a table of all your portfolio snapshots

### Step 2: Open a Snapshot
1. Click on any snapshot row in the table
2. OR click the **View** button on the right side of the snapshot

### Step 3: View the Pie Chart
The **Portfolio Snapshot** modal will open with:
- **Pie Chart** at the top showing asset distribution
- **Detailed breakdown** table below with exact amounts
- **Total portfolio value** highlighted at the bottom

## 🎨 Understanding the Chart

### What the Pie Chart Shows
- **Visual breakdown** of your total portfolio
- **Each slice** represents one asset type
- **Colors** make it easy to identify different categories
- **Legend** at the bottom lists all categories included

### Reading the Chart

**Hover over any slice to see:**
- Asset category name
- Amount in Indian Rupees (₹)
- Percentage of total portfolio

**Example:**
```
Fixed Deposits: ₹100,000.00 (35.1%)
```

### Size Matters
- **Larger slices** = Larger portion of your portfolio
- **Smaller slices** = Smaller portion of your portfolio
- **Missing assets** = Zero value (automatically excluded)

## 🎯 Color Guide

| Color | Asset Type |
|-------|-----------|
| 🔴 Red | Cash |
| 🔵 Teal | Savings Account |
| 🔷 Blue | Fixed Deposits |
| 🟢 Green | Recurring Deposits |
| 🟡 Yellow | PPF |
| 🟠 Brown | EPF |
| 🟤 Dark Brown | NPS |
| 🟣 Purple | Mutual Funds |
| 🔴 Dark Red | Stocks |
| 🟠 Orange | Gold |
| 🟢 Dark Green | Emergency Fund |
| 🔴 Rose | Loans |

## 💡 Tips & Tricks

### Best Practices
1. **Create regular snapshots** to track portfolio growth over time
2. **Compare snapshots** to see how your allocation changes
3. **Use the chart for planning** to identify underweighted areas
4. **Check percentages** to ensure balanced portfolio distribution

### Using the Data
- **Rebalancing**: Use chart to identify portfolio drift
- **Goal Setting**: Set targets for different asset classes
- **Risk Assessment**: See if emergency fund is adequate
- **Growth Tracking**: Compare snapshots month-over-month

### Mobile Usage
- Chart automatically scales for phone/tablet screens
- Easier to read with proper zoom
- Touch-friendly hover tooltips

## 🔍 Detailed View Features

Below the pie chart, you'll see a detailed grid showing:

### Asset Categories
- **Cash** - Liquid funds
- **Savings Account** - Bank savings
- **Fixed Deposits** - FD investments
- **Recurring Deposits** - RD investments
- **PPF** - Public Provident Fund
- **EPF** - Employee Provident Fund
- **NPS** - National Pension Scheme
- **Mutual Funds** - MF investments
- **Stocks** - Stock holdings
- **Gold** - Gold investments
- **Emergency Fund** - Emergency reserve
- **Loans** - Outstanding loans

### Summary Information
- **Created Date** - When snapshot was created
- **Created By** - User who created it
- **Total Portfolio Value** - Sum of all assets

## ❌ Troubleshooting

### Chart Not Showing
**Problem:** "No portfolio data to display"
**Solution:** 
- Make sure you have deposits with amount_accumulated > 0
- Create a new snapshot after adding deposits
- Refresh the page

### Chart Looks Distorted
**Problem:** Chart isn't rendering correctly
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page (F5)
- Close and reopen the modal

### Percentage Not Adding to 100%
**Problem:** Percentages shown on hover don't add up
**Solution:**
- This is normal due to rounding
- Actual data is precise, just displayed rounded for readability

### Chart Too Small on Mobile
**Problem:** Chart is hard to see on phone
**Solution:**
- Rotate device to landscape mode
- Pinch to zoom on the modal
- Use the detailed breakdown table below for exact values

## 📱 Responsive Behavior

### Desktop View
- Full-size chart for optimal visibility
- Legend clearly visible below
- All details easily readable

### Tablet View
- Chart slightly smaller to fit screen
- Legend remains below
- Touch-friendly interaction

### Mobile View
- Compact chart to fit phone screen
- Tap-friendly legend items
- Scroll to see all details

## 🎬 Example Workflow

### Creating and Viewing a Snapshot

```
1. Add Deposits
   └─ Add different types: SA, FD, RD, PPF, etc.

2. Navigate to Snapshots
   └─ Click "Snapshots" in menu

3. Create Snapshot
   └─ Click "📸 Create Snapshot" button
   └─ Confirm creation

4. View Pie Chart
   └─ Click on snapshot in table
   └─ See pie chart distribution
   └─ Hover over slices for details

5. Analyze
   └─ Check what % is in each category
   └─ See if portfolio is balanced
   └─ Plan rebalancing if needed
```

## 📊 Interpretation Examples

### Example 1: Balanced Portfolio
```
- Savings: 20%
- Fixed Deposits: 35%
- Recurring Deposits: 15%
- Emergency Fund: 20%
- PPF: 10%
```
✅ Good diversification across liquid and locked-in assets

### Example 2: Cash Heavy
```
- Savings: 60%
- Fixed Deposits: 20%
- Others: 20%
```
⚠️ Consider moving excess cash to FDs for better returns

### Example 3: Emergency Fund Low
```
- Emergency Fund: 5% (too low)
- Ideal: 15-20%
```
⚠️ Build emergency fund before investing more

## 🔄 Comparing Snapshots

To compare multiple snapshots:
1. Open first snapshot and note the percentages
2. Close modal (click Close button)
3. Open another snapshot
4. Compare distributions side-by-side
5. Identify changes and trends

## ⚙️ How Data is Calculated

### Portfolio Value = Sum of:
- Cash deposits
- Savings account balances
- Fixed deposit accumulated amounts
- Recurring deposit accumulated amounts
- PPF balances
- EPF balances
- NPS contributions
- Mutual fund values
- Stock holdings
- Gold investments
- Minus any loans

### Percentage Calculation
```
Asset Percentage = (Asset Value / Total Portfolio Value) × 100
```

## 📈 Tips for Portfolio Growth

Using the pie chart to improve your portfolio:

1. **Identify Gaps** - See which categories are missing
2. **Rebalance** - Move funds if allocation is uneven
3. **Set Goals** - Target allocation percentages
4. **Track Progress** - Compare snapshots over time
5. **Adjust Strategy** - Based on life changes

## 🆘 Need Help?

For more detailed information:
- See [SNAPSHOT_PIE_CHART_GUIDE.md](SNAPSHOT_PIE_CHART_GUIDE.md) for technical details
- See [SNAPSHOT_PIE_CHART_IMPLEMENTATION.md](SNAPSHOT_PIE_CHART_IMPLEMENTATION.md) for architecture
- Check snapshot table for exact numerical values

## 🎉 Features Summary

✅ Visual portfolio distribution  
✅ Color-coded asset categories  
✅ Interactive hover tooltips  
✅ Percentage calculations  
✅ Legend display  
✅ Responsive design (desktop, tablet, mobile)  
✅ Zero-value filtering  
✅ Currency formatting (₹ INR)  

Enjoy better portfolio visualization! 📊
