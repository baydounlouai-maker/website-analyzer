const express = require('express');
const cors = require('cors');
const { parse } = require('node-html-parser');

const { fetchPage } = require('./scraper');
const { analyzeSEO } = require('./analyzers/seo');
const { analyzePerformance } = require('./analyzers/performance');
const { analyzeContent } = require('./analyzers/content');
const { analyzeLinks } = require('./analyzers/links');
const { analyzeMedia } = require('./analyzers/media');
const { computeScores } = require('./analyzers/score');

const app = express();
const PORT = 3000;

// need this to allow requests from the frontend or else they get blocked
app.use(cors());
app.use(express.json());

// localhost:3000/api/analyze
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url); // validate URL format
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const { html, size } = await fetchPage(url);
    const root = parse(html);

    const seo = analyzeSEO(root);
    const performance = analyzePerformance(root, size);
    const content = analyzeContent(root);
    const links = analyzeLinks(root, url);
    const media = analyzeMedia(root);
    const scores = computeScores(seo, performance);

    res.json({ seo, performance, content, links, media, scores });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch or analyze the page. ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});