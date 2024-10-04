const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { subWeeks, startOfWeek, endOfWeek, format, getISOWeek, getWeek  } = require('date-fns'); 
const pool = require('../db/connection'); 
const ChartDataLabels = require('chartjs-plugin-datalabels'); // Import the datalabels plugin
const Chart = require('chart.js'); // Import Chart.js

// Register the datalabels plugin globally with Chart.js
Chart.register(ChartDataLabels);


const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Query to get spending by category
async function getSpendingByCategory(userId) {
  const result = await pool.query(`
    SELECT category, SUM(amount_out) AS total_spent
    FROM transactions
    WHERE user_id = $1
    GROUP BY category
  `, [userId]);
  
  return result.rows;  // [{ category: 'Groceries', total_spent: 150 }, ...]
}

async function getTransfersBySender(recipientId) {
  const result = await pool.query(`
    SELECT u.username AS sender_name, SUM(t.amount) AS total_received
    FROM transfers t
    JOIN users u ON u.user_id = t.sender_id
    WHERE t.recipient_id = $1
    GROUP BY u.username
    ORDER BY total_received DESC;
  `, [recipientId]);

  return result.rows;  // Example: [{ sender_name: 'Alice', total_received: 100 }, ...]
}

async function getTotalSpendingForMonth(userId) {
  const result = await pool.query(`
    SELECT SUM(amount_out) AS total_spent
    FROM transactions
    WHERE user_id = $1
    AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)
  `, [userId]);

  return result.rows.length ? parseFloat(result.rows[0].total_spent) : 0;
}

async function getTransfersByRecipient(senderId) {
  const result = await pool.query(`
    SELECT 
      u_recipient.username AS recipient_name, 
      SUM(t.amount) AS total_transferred
    FROM transfers t
    JOIN users u_recipient ON t.recipient_id = u_recipient.user_id
    WHERE t.sender_id = $1
    GROUP BY u_recipient.username
    ORDER BY total_transferred DESC;
  `, [senderId]);

  return result.rows; // [{ recipient_name: 'Alice', total_transferred: 100.00 }, ...]
}

// Query to get user's monthly budget
async function getUserBudget(userId) {
  const result = await pool.query(`
    SELECT month_budget 
    FROM budget 
    WHERE user_id = $1
  `, [userId]);
  
  return result.rows.length ? parseFloat(result.rows[0].month_budget) : 0;
}

// Query to get total spending per week for the current month
async function getWeeklySpending(userId) {
  const result = await pool.query(`
    SELECT
      EXTRACT(WEEK FROM date) AS week_number,
      SUM(amount_out) AS total_spent
    FROM transactions
    WHERE user_id = $1
    AND date >= NOW() - INTERVAL '4 weeks'
    GROUP BY week_number
    ORDER BY week_number ASC;
  `, [userId]);

  return result.rows;  // [{ week_number: 36, total_spent: 200 }, ...]
}

// Query to get total spending over a time period (week, month, etc.)
async function getSpendingOverTime(userId, interval) {
  const result = await pool.query(`
    SELECT date, SUM(amount_out) AS total_spent
    FROM transactions
    WHERE user_id = $1 AND date >= NOW() - INTERVAL '${interval}'
    GROUP BY date
    ORDER BY date ASC
  `, [userId]);

  return result.rows;  // [{ date: '2024-01-01', total_spent: 150 }, ...]
}

async function generateRecipientTransfersChart(senderId) {
  const transferData = await getTransfersByRecipient(senderId);

  // Extract labels (recipient names) and data (total amounts transferred)
  const labels = transferData.map(item => item.recipient_name);
  const data = transferData.map(item => parseFloat(item.total_transferred));

  const chartConfig = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Total Transferred Amount',
        data,
        backgroundColor: '#FF6384',
        borderColor: '#FFFFFF',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',  // Horizontal bar chart
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount Transferred ($)',  // x-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Recipient Names',  // y-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              let value = tooltipItem.raw || 0;
              return `Amount: $${value.toFixed(2)}`;
            }
          }
        },
        datalabels: {
          color: '#000',  // Set text color to black
          anchor: 'center',
          align: 'center',
          formatter: function(value) {
            return value;  // Display the value inside the bar
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(chartConfig);
}



// Generate budget tracking chart for the month (week-to-week)
async function generateBudgetTrackingChart(userId) {
  const budget = await getUserBudget(userId);
  const weeklySpendingData = await getWeeklySpending(userId);

  // Initialize variables
  const remainingBudgetByWeek = [];
  const weeklySpendingByWeek = [];
  const labels = [];

  let currentDate = new Date();
  let remainingBudget = budget;

  for (let i = 3; i >= 0; i--) {
    const startOfWeekDate = startOfWeek(subWeeks(currentDate, i), { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(subWeeks(currentDate, i), { weekStartsOn: 1 });

    const startOfWeekFormatted = format(startOfWeekDate, 'MM/dd');
    const endOfWeekFormatted = format(endOfWeekDate, 'MM/dd');
    const weekLabel = `Week ${format(startOfWeekDate, 'wo')} (${startOfWeekFormatted} - ${endOfWeekFormatted})`;

    labels.push(weekLabel);

    const currentWeekNumber = getISOWeek(startOfWeekDate);
    const weekData = weeklySpendingData.find(item => parseInt(item.week_number) === currentWeekNumber);

    let weeklySpent = 0;
    if (weekData) {
      weeklySpent = parseFloat(weekData.total_spent);
    }

    weeklySpendingByWeek.push(weeklySpent);
    remainingBudget -= weeklySpent;
    remainingBudgetByWeek.push(remainingBudget);
  }

  const chartConfig = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Remaining Budget by Week',
        data: remainingBudgetByWeek,
        backgroundColor: remainingBudgetByWeek.map(value => value >= 0 ? '#36A2EB' : '#FF6384'),
        borderColor: '#FFFFFF',
        borderWidth: 1
      }, {
        label: 'Weekly Spending',
        data: weeklySpendingByWeek,
        backgroundColor: '#FFA500',
        borderColor: '#FFFFFF',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Week', // x-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        y: {
          beginAtZero: true,
          suggestedMin: Math.min(...remainingBudgetByWeek) - 100,
          title: {
            display: true,
            text: 'Amount ($)', // y-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              let value = tooltipItem.raw || 0;
              return value >= 0 
                ? `Remaining Budget: $${value.toFixed(2)}`
                : `Overspent: $${Math.abs(value).toFixed(2)}`;
            }
          }
        },
        datalabels: {
          color: '#000',
          anchor: 'center',
          align: 'center',
          formatter: function(value) {
            return value;
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(chartConfig);
}



// Generate pie chart for spending by category
async function generateSpendingByCategoryChart(userId) {
  const spendingData = await getSpendingByCategory(userId);
  const labels = spendingData.map(item => item.category);
  const data = spendingData.map(item => parseFloat(item.total_spent));

  const chartConfig = {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#E7E9ED', '#B23C32', '#5B9279', '#FF85F1'
        ],
        borderColor: '#FFFFFF',
        borderWidth: 1,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          color: ' #000000', // White text on slices
          formatter: function(value, context) {
            return context.chart.data.labels[context.dataIndex]; // Show category names on slices
          },
          font: {
            weight: 'bold',
            size: 12,
          },
          align: 'end', // Aligns the text at the edge of the slice
          anchor: 'end', // Anchors the text to the outside of the slice
          offset: -75,   // Adds some space between the slice and the label
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              let label = tooltipItem.label || '';
              let value = tooltipItem.raw || 0;
              return `${label}: $${value.toFixed(2)}`;
            }
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(chartConfig);
}


// Generate line chart for spending over the last week
async function generateSpendingLastWeekChart(userId) {
  const spendingData = await getSpendingOverTime(userId, '7 days');
  const labels = spendingData.map(item => format(new Date(item.date), 'EEEE')); // Format to get weekday names (e.g., Monday)
  const data = spendingData.map(item => parseFloat(item.total_spent));

  const chartConfig = {
    type: 'line',
    data: {
      labels, // Days of the week
      datasets: [{
        label: 'Spending Over the Last Week',
        data,
        fill: false,
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'category', // Use category type since we're using formatted day names
          title: {
            display: true,
            text: 'Day of the Week', // x-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount Spent ($)', // y-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        datalabels: {
          color: '#000',  // Set text color to black
          anchor: 'end',
          align: 'end',
          offset: 5,   
          formatter: function(value) {
            return value;  // Display the value inside the bar
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(chartConfig);
}

// Generate line chart for spending over the last month
async function generateSpendingLastMonthChart(userId) {
  const spendingData = await getSpendingOverTime(userId, '30 days');
  const labels = spendingData.map(item => format(new Date(item.date), 'MM/dd/yyyy')); // Format to MM/DD/YYYY
  const data = spendingData.map(item => parseFloat(item.total_spent));

  const chartConfig = {
    type: 'line',
    data: {
      labels, // Formatted dates
      datasets: [{
        label: 'Spending Over the Last Month',
        data,
        fill: false,
        borderColor: '#FF6384',
        backgroundColor: '#FF6384',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'category', // Use category since we're using formatted dates
          title: {
            display: true,
            text: 'Date (MM/DD/YYYY)', // x-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount Spent ($)', // y-axis label
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        datalabels: {
          color: '#000',  // Set text color to black
          anchor: 'end',
          align: 'end',
          offset: 5,
          formatter: function(value) {
            return value;  // Display the value inside the bar
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(chartConfig);
}

async function generateIncomingTransfersChart(recipientId) {
  const transferData = await getTransfersBySender(recipientId);

  // Extract labels (sender names) and data (total amounts received)
  const labels = transferData.map(item => item.sender_name);
  const data = transferData.map(item => parseFloat(item.total_received));

  const chartConfig = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Total Received Amount',
        data,
        backgroundColor: '#36A2EB',
        borderColor: '#FFFFFF',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',  // Horizontal bar chart
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount Received ($)',  // Label for the x-axis
            font: {
              size: 14,
              weight: 'bold',
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sender Name',  // Label for the y-axis
            font: {
              size: 14,
              weight: 'bold',
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              let value = tooltipItem.raw || 0;
              return `Amount: $${value.toFixed(2)}`;
            }
          }
        },
        datalabels: {
          color: '#000',  // Set text color to black
          anchor: 'center',
          align: 'center',
          formatter: function(value) {
            return value;  // Display the value inside the bar
          }
        }
      }
    }
  };

  return await chartJSNodeCanvas.renderToBuffer(chartConfig);
}

module.exports = {
  generateSpendingByCategoryChart,
  generateSpendingLastWeekChart,
  generateSpendingLastMonthChart,
  generateBudgetTrackingChart,
  generateRecipientTransfersChart,
  generateIncomingTransfersChart
};


