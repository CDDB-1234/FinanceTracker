/**
 * Export Service - Handles exporting data to Excel format
 */

/**
 * Generate Excel file with deposits, snapshots, and bank/holder summary
 */
export const exportToExcel = async (deposits, snapshots, bankHolderSummary, userName) => {
  try {
    // Dynamically import xlsx library
    const XLSX = await import('xlsx');

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Prepare Deposits Sheet
    const depositsData = deposits.map(deposit => ({
      'Bank': deposit.bank,
      'Account Holder': deposit.account_holder,
      'Account Type': deposit.investment_account_type,
      'Account Number': deposit.account_number,
      'Deposit Amount': `₹${formatCurrencyForExcel(deposit.deposit_amount)}`,
      'Amount Accumulated': `₹${formatCurrencyForExcel(deposit.amount_accumulated)}`,
      'Interest Rate (%)': deposit.interest_rate,
      'Interest Amount': `₹${formatCurrencyForExcel(deposit.interest_amount)}`,
      'Maturity Amount': `₹${formatCurrencyForExcel(deposit.maturity_amount)}`,
      'Start Date': formatDateForExcel(deposit.start_date),
      'Maturity Date': formatDateForExcel(deposit.maturity_date),
      'Status': deposit.account_status,
      'Comments': deposit.comments,
      'Plan on Maturity': deposit.plan_on_maturity,
      'Deposit Type': deposit.deposit_type,
      'Created Date': formatDateForExcel(deposit.created_at),
      'Created By': deposit.createdBy
    }));

    const depositsWorksheet = XLSX.utils.json_to_sheet(depositsData);
    // Set column widths
    depositsWorksheet['!cols'] = [
      { wch: 15 }, // Bank
      { wch: 15 }, // Account Holder
      { wch: 15 }, // Account Type
      { wch: 20 }, // Account Number
      { wch: 15 }, // Deposit Amount
      { wch: 18 }, // Amount Accumulated
      { wch: 15 }, // Interest Rate
      { wch: 15 }, // Interest Amount
      { wch: 15 }, // Maturity Amount
      { wch: 15 }, // Start Date
      { wch: 15 }, // Maturity Date
      { wch: 12 }, // Status
      { wch: 25 }, // Comments
      { wch: 15 }, // Plan on Maturity
      { wch: 15 }, // Deposit Type
      { wch: 15 }, // Created Date
      { wch: 15 }  // Created By
    ];
    XLSX.utils.book_append_sheet(workbook, depositsWorksheet, 'Deposits');

    // Prepare Bank & Holder Summary Sheet
    if (bankHolderSummary && bankHolderSummary.summary) {
      const summaryData = [];
      let grandTotal = 0;

      // Add title row
      summaryData.push({
        'Bank': 'BANK & HOLDER SUMMARY',
        'Recurring Deposit': '',
        'Fixed Deposits': '',
        'PPF': '',
        'Savings': '',
        'Account Holder': '',
        'Total': ''
      });

      // Add data rows
      Object.entries(bankHolderSummary.summary).forEach(([bank, holders]) => {
        let bankTotal = 0;
        let bankRecurring = 0;
        let bankFixed = 0;
        let bankPPF = 0;
        let bankSavings = 0;

        Object.entries(holders).forEach(([holder, data]) => {
          summaryData.push({
            'Bank': bank,
            'Recurring Deposit': `₹${formatCurrencyForExcel(data['Recurring Deposit'])}`,
            'Fixed Deposits': `₹${formatCurrencyForExcel(data['Fixed Deposits'])}`,
            'PPF': `₹${formatCurrencyForExcel(data['PPF'])}`,
            'Savings': `₹${formatCurrencyForExcel(data['Savings'])}`,
            'Account Holder': holder,
            'Total': `₹${formatCurrencyForExcel(data['total_amount'])}`
          });

          bankTotal += data['total_amount'];
          bankRecurring += data['Recurring Deposit'];
          bankFixed += data['Fixed Deposits'];
          bankPPF += data['PPF'];
          bankSavings += data['Savings'];
          grandTotal += data['total_amount'];
        });

        // Add bank subtotal row
        summaryData.push({
          'Bank': `Subtotal (${bank})`,
          'Recurring Deposit': `₹${formatCurrencyForExcel(bankRecurring)}`,
          'Fixed Deposits': `₹${formatCurrencyForExcel(bankFixed)}`,
          'PPF': `₹${formatCurrencyForExcel(bankPPF)}`,
          'Savings': `₹${formatCurrencyForExcel(bankSavings)}`,
          'Account Holder': '',
          'Total': `₹${formatCurrencyForExcel(bankTotal)}`
        });

        // Add empty row for separation
        summaryData.push({
          'Bank': '',
          'Recurring Deposit': '',
          'Fixed Deposits': '',
          'PPF': '',
          'Savings': '',
          'Account Holder': '',
          'Total': ''
        });
      });

      // Add grand total row
      summaryData.push({
        'Bank': 'GRAND TOTAL',
        'Recurring Deposit': '',
        'Fixed Deposits': '',
        'PPF': '',
        'Savings': '',
        'Account Holder': '',
        'Total': `₹${formatCurrencyForExcel(grandTotal)}`
      });

      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
      summaryWorksheet['!cols'] = [
        { wch: 20 }, // Bank
        { wch: 18 }, // Recurring Deposit
        { wch: 18 }, // Fixed Deposits
        { wch: 12 }, // PPF
        { wch: 12 }, // Savings
        { wch: 18 }, // Account Holder
        { wch: 18 }  // Total
      ];
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Bank & Holder Summary');
    }

    // Prepare Snapshots Sheet
    const snapshotsData = snapshots.map(snapshot => ({
      'Created Date': formatDateForExcel(snapshot.createdAt),
      'Created By': snapshot.createdBy,
      'Cash': `₹${formatCurrencyForExcel(snapshot.cash)}`,
      'Savings': `₹${formatCurrencyForExcel(snapshot.savings)}`,
      'Fixed Deposits': `₹${formatCurrencyForExcel(snapshot.fd)}`,
      'Recurring Deposits': `₹${formatCurrencyForExcel(snapshot.rd)}`,
      'PPF': `₹${formatCurrencyForExcel(snapshot.ppf)}`,
      'EPF': `₹${formatCurrencyForExcel(snapshot.epf)}`,
      'NPS': `₹${formatCurrencyForExcel(snapshot.nps)}`,
      'Mutual Funds': `₹${formatCurrencyForExcel(snapshot.mf)}`,
      'Stocks': `₹${formatCurrencyForExcel(snapshot.stocks)}`,
      'Gold': `₹${formatCurrencyForExcel(snapshot.gold)}`,
      'Loans': `₹${formatCurrencyForExcel(snapshot.loans)}`,
      'Emergency Fund': `₹${formatCurrencyForExcel(snapshot.emergency_fund)}`,
      'Total': `₹${formatCurrencyForExcel(snapshot.total)}`
    }));

    const snapshotsWorksheet = XLSX.utils.json_to_sheet(snapshotsData);
    // Set column widths
    snapshotsWorksheet['!cols'] = [
      { wch: 20 }, // Created Date
      { wch: 15 }, // Created By
      { wch: 12 }, // Cash
      { wch: 12 }, // Savings
      { wch: 15 }, // Fixed Deposits
      { wch: 18 }, // Recurring Deposits
      { wch: 12 }, // PPF
      { wch: 12 }, // EPF
      { wch: 12 }, // NPS
      { wch: 15 }, // Mutual Funds
      { wch: 12 }, // Stocks
      { wch: 12 }, // Gold
      { wch: 12 }, // Loans
      { wch: 15 }, // Emergency Fund
      { wch: 15 }  // Total
    ];
    XLSX.utils.book_append_sheet(workbook, snapshotsWorksheet, 'Snapshots');

    // Prepare Summary Sheet
    const summaryData = [
      { Category: 'Export Date', Value: formatDateForExcel(new Date()) },
      { Category: 'Exported By', Value: userName },
      { Category: 'Total Deposits', Value: deposits.length },
      { Category: 'Total Snapshots', Value: snapshots.length }
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [
      { wch: 20 },
      { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `FinanceTracker_${userName}_${timestamp}.xlsx`;

    // Write the workbook
    XLSX.writeFile(workbook, filename);

    return { success: true, message: `File downloaded: ${filename}` };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, message: `Export failed: ${error.message}` };
  }
};

/**
 * Format date for Excel export
 */
const formatDateForExcel = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * Format currency for Excel
 */
export const formatCurrencyForExcel = (value) => {
  if (!value) return '0.00';
  try {
    // Remove any currency symbols and commas, then parse
    const cleanValue = String(value).replace(/[₹,]/g, '').trim();
    return parseFloat(cleanValue).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch {
    return '0.00';
  }
};

export default exportToExcel;
