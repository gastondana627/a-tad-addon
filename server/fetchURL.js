// server/fetchURL.js
import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

router.post('/fetch-url', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;

    // Example: Get first 3 player names from a table (can be customized per site)
    const $ = cheerio.load(html);
    const players = [];

    $('.RosterRow_playerName__G28lg').each((i, el) => {
      if (i < 3) {
        players.push($(el).text().trim());
      }
    });

    res.json({ players });
  } catch (error) {
    console.error('❌ Error fetching URL:', error.message);
    res.status(500).json({ error: 'Failed to fetch and parse the URL.' });
  }
});

export default router;


