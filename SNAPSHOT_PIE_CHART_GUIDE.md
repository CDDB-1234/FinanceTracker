# Snapshot Pie Chart Feature

## Overview
A pie chart visualization has been added to the Portfolio Snapshots feature to provide a visual representation of your portfolio distribution across different investment categories.

## Features

### Chart Visualization
- **Visual Portfolio Distribution**: See how your assets are distributed across different investment types
- **Color-Coded Categories**: Each asset type has a distinct color for easy identification:
  - Cash: Red
  - Savings Account: Teal
  - Fixed Deposits: Blue
  - Recurring Deposits: Green
  - PPF: Light Yellow
  - EPF: Brown
  - NPS: Dark Brown
  - Mutual Funds: Purple
  - Stocks: Dark Red
  - Gold: Orange
  - Emergency Fund: Green
  - Loans: Red

### Interactive Features
- **Hover Information**: Hover over any pie slice to see:
  - Asset category name
  - Amount in Indian Rupees (₹)
  - Percentage of total portfolio
- **Legend**: A legend at the bottom shows all asset categories included in the snapshot
- **Responsive Design**: The chart automatically adjusts to different screen sizes

### Zero Value Handling
- Categories with zero values are automatically excluded from the pie chart
- Only non-zero assets are displayed for clarity

## How to Use

### Viewing the Pie Chart
1. Navigate to the **Portfolio Snapshots** page
2. Click on any snapshot in the table or click the **View** button
3. The **Portfolio Snapshot** detail modal will open
4. The **pie chart** is displayed at the top of the modal, showing your portfolio distribution

### Interpreting the Chart
- **Larger slices** represent larger portions of your portfolio
- **Colors** help you quickly identify asset types
- **Percentages** show what portion of your total portfolio each asset represents
- **Total portfolio value** is shown in the detailed breakdown below the chart

## File Structure

### New Files Created
- `frontend/src/components/SnapshotPieChart.js` - The pie chart component
- `frontend/src/styles/SnapshotPieChart.css` - Styling for the pie chart

### Modified Files
- `frontend/src/pages/Snapshots.js` - Updated to include the pie chart import and component
- `frontend/package.json` - Added dependencies: chart.js and react-chartjs-2

## Dependencies
The feature uses the following libraries:
- **chart.js** (v4.4.0) - Charting library
- **react-chartjs-2** (v5.2.0) - React wrapper for Chart.js

## Technical Details

### SnapshotPieChart Component
The component accepts a snapshot object and automatically:
1. Filters out zero and negative values
2. Prepares data in the format required by Chart.js
3. Applies colors and formatting
4. Handles responsive sizing
5. Displays currency values in Indian Rupees

### Chart Configuration
- **Type**: Pie Chart
- **Legend Position**: Bottom
- **Border**: White borders (2px) around slices
- **Hover Effect**: Slight offset for better interaction feedback
- **Tooltips**: Show detailed information with percentage calculations

## Responsive Design
- On desktop: Full-size chart (max-width: 400px)
- On tablet (≤ 768px): Adjusted sizing (max-width: 300px)
- On mobile (≤ 480px): Compact view (max-width: 250px)

## Usage Example
```javascript
<SnapshotPieChart snapshot={selectedSnapshot} />
```

Where `snapshot` contains:
```javascript
{
  cash: 1000,
  savings: 50000,
  fd: 100000,
  rd: 20000,
  ppf: 30000,
  epf: 40000,
  nps: 15000,
  mf: 0,
  stocks: 0,
  gold: 5000,
  emergency_fund: 25000,
  loans: 0,
  total: 286000
}
```

## Future Enhancements
Potential improvements for the pie chart feature:
- Drill-down functionality to see transactions for each category
- Comparison between multiple snapshots
- Export chart as image
- Category-wise growth trends
- Rebalancing suggestions based on portfolio distribution

## Troubleshooting

### Chart Not Displaying
- Ensure npm packages are installed: `npm install`
- Check browser console for any JavaScript errors
- Verify snapshot data contains valid numeric values

### Chart Shows "No portfolio data"
- This occurs when all asset values are zero
- Create a snapshot after adding deposits to your account

### Styling Issues
- Clear browser cache and reload the page
- Ensure `SnapshotPieChart.css` is properly imported in Snapshots.js
