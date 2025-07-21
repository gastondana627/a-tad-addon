const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Basic POST route
app.post('/scrape', (req, res) => {
  const { url, prompt } = req.body;

  console.log(`🟢 Received URL: ${url}`);
  console.log(`🟡 Received Prompt: ${prompt}`);

  // Simulated response
  res.json({ message: `Generated video based on: ${url} and prompt: "${prompt}"` });
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});