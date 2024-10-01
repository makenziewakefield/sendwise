const express = require('express');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const router = express.Router();
const pool = require('../db/connection'); // PostgreSQL connection

const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Route to get spending by category for a pie chart
router.get('/spending-by-category-chart', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id query parameter' });
  }

  try {
    const result = await pool.query(`
      SELECT category, SUM(amount_out) AS total_spent
      FROM transactions
      WHERE user_id = $1
      GROUP BY category
    `, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No spending data found for this user' });
    }

    const spendingData = result.rows;
    const labels = spendingData.map(item => item.category);
    const data = spendingData.map(item => parseFloat(item.total_spent));
    const chartConfig = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#E7E9ED', '#B23C32', '#5B9279', '#FF85F1'
            ]
          }
        ]
      }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);

    res.type('image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).json({ message: 'Failed to generate chart' });
  }
});

module.exports = router;