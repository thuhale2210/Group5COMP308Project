const express = require('express');
const router = express.Router();
const { getSummary } = require('../services/gemini');

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing "text" in request' });

  try {
    const summary = await getSummary(text);
    res.json({ summary });
  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;