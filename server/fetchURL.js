// server/fetchRoster.js
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/nba-roster', async (req, res) => {
  try {
    const response = await fetch('https://www.nba.com/spurs/roster');
    const html = await response.text();
    res.send(html); // (You can later parse it into JSON)
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch NBA data.' });
  }
});

export default router;