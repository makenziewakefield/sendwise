const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const pool = require('../db'); // Assuming pg-pool is used for database connection

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

// Function to generate pie chart based on spending by category
async function generateSpendingByCategoryChart(userId) {
  const spendingData = await getSpendingByCategory(userId);

  // Extract labels and data for the pie chart
  const labels = spendingData.map(item => item.category);
  const data = spendingData.map(item => item.total_spent);

  // Chart configuration
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
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
  return imageBuffer;
}

module.exports = { generateSpendingByCategoryChart };