import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Plugin } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const SnapshotPieChart = ({ snapshot }) => {
  if (!snapshot) return null;

  // Define colors for each asset type
  const colors = {
    cash: '#FF6B6B',
    savings: '#4ECDC4',
    fd: '#45B7D1',
    rd: '#96CEB4',
    ppf: '#FFEAA7',
    epf: '#DDA15E',
    nps: '#BC6C25',
    mf: '#9D84B7',
    stocks: '#D62828',
    gold: '#F77F00',
    loans: '#E63946',
    emergency_fund: '#06A77D'
  };

  // Prepare data for the pie chart - only include non-zero values
  const categories = [
    { label: 'Cash', value: snapshot.cash, color: colors.cash },
    { label: 'Savings Account', value: snapshot.savings, color: colors.savings },
    { label: 'Fixed Deposits', value: snapshot.fd, color: colors.fd },
    { label: 'Recurring Deposits', value: snapshot.rd, color: colors.rd },
    { label: 'PPF', value: snapshot.ppf, color: colors.ppf },
    { label: 'EPF', value: snapshot.epf, color: colors.epf },
    { label: 'NPS', value: snapshot.nps, color: colors.nps },
    { label: 'Mutual Funds', value: snapshot.mf, color: colors.mf },
    { label: 'Stocks', value: snapshot.stocks, color: colors.stocks },
    { label: 'Gold', value: snapshot.gold, color: colors.gold },
    { label: 'Emergency Fund', value: snapshot.emergency_fund, color: colors.emergency_fund },
    { label: 'Loans', value: snapshot.loans, color: colors.loans }
  ];

  // Filter out zero values and negative values
  const filteredCategories = categories.filter(cat => cat.value > 0);

  if (filteredCategories.length === 0) {
    return (
      <div className="pie-chart-container">
        <p className="no-data">No portfolio data to display</p>
      </div>
    );
  }

  const labels = filteredCategories.map(cat => cat.label);
  const data = filteredCategories.map(cat => cat.value);
  const bgColors = filteredCategories.map(cat => cat.color);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: bgColors,
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 'normal'
          },
          generateLabels: function(chart) {
            const datasets = chart.data.datasets;
            const labels = chart.data.labels;
            return labels.map((label, i) => ({
              text: label,
              fillStyle: datasets[0].backgroundColor[i],
              hidden: false,
              index: i
            }));
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            return `${label}: ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="pie-chart-container">
      <div className="pie-chart-wrapper">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SnapshotPieChart;
