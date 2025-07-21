// server/index.js
import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // 👈 explicitly load from project root

import OpenAI from "openai";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";


const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route to handle scraping + AI prompting
app.post('/scrape', async (req, res) => {
  const { url, prompt } = req.body;

  if (!url || !prompt) {
    return res.status(400).json({ error: 'URL and prompt are required' });
  }

  try {
    // Step 1: Scrape content from the URL
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Step 2: Extract readable text
    const scrapedText = $('body')
      .find('*')
      .not('script, style, noscript')
      .map((i, el) => $(el).text())
      .get()
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Optional: Limit the size of the scraped text
    const truncatedText = scrapedText.slice(0, 4000); // GPT-safe

    // Step 3: Send prompt + data to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that analyzes webpage content and provides a response based on the user\'s request.',
        },
        {
          role: 'user',
          content: `The user provided the following webpage data:\n\n"${truncatedText}"\n\nNow answer this: ${prompt}`,
        },
      ],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim() || 'No response from AI';

    return res.status(200).json({ message: aiResponse });
  } catch (error) {
    console.error('❌ Error scraping or generating response:', error.message);
    return res.status(500).json({ error: 'Failed to process request' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});




