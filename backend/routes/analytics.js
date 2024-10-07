const express = require('express');
const router = express.Router();

const { 
  generateSpendingByCategoryChart, 
  generateSpendingLastWeekChart, 
  generateSpendingLastMonthChart,
  generateBudgetTrackingChart,
  generateRecipientTransfersChart,
  generateIncomingTransfersChart
} = require('../services/chartService');

router.get('/incoming-transfers-chart', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id query parameter' });
  }

  try {
    const imageBuffer = await generateIncomingTransfersChart(user_id);
    res.type('image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).json({ message: 'Failed to generate chart' });
  }
});

router.get('/budget-tracking-chart', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id query parameter' });
  }

  try {
    const imageBuffer = await generateBudgetTrackingChart(user_id);
    res.type('image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).json({ message: 'Failed to generate chart' });
  }
});

router.get('/recipient-transfers-chart', async (req, res) => {
  const { sender_id } = req.query;

  if (!sender_id) {
    return res.status(400).json({ message: 'Missing sender_id query parameter' });
  }

  try {
    const imageBuffer = await generateRecipientTransfersChart(sender_id);
    res.type('image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).json({ message: 'Failed to generate chart' });
  }
});

// Route to get spending by category for a pie chart
router.get('/spending-by-category-chart', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id query parameter' });
  }

  try {
    const imageBuffer = await generateSpendingByCategoryChart(user_id);
    res.type('image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).json({ message: 'Failed to generate chart' });
  }
});

// Route for spending over the last week (line chart)
router.get('/spending-last-week-chart', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id query parameter' });
  }

  try {
    const imageBuffer = await generateSpendingLastWeekChart(user_id);
    res.type('image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).json({ message: 'Failed to generate chart' });
  }
});

// Route for spending over the last month (line chart)
router.get('/spending-last-month-chart', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id query parameter' });
  }

  try {
    const imageBuffer = await generateSpendingLastMonthChart(user_id);
    res.type('image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).json({ message: 'Failed to generate chart' });
  }
});

module.exports = router;