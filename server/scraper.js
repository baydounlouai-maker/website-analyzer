const axios = require('axios');

async function fetchPage(url) {
  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; WebsiteAnalyzer/1.0)'
    },
    maxContentLength: 5 * 1024 * 1024
  });

  const html = response.data;
  const size = Buffer.byteLength(html, 'utf8');

  return { html, size };
}

module.exports = { fetchPage };
