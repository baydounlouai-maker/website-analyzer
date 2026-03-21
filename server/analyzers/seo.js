const { removeStopwords } = require('stopword');

function analyzeSEO(root) {
  // Title
  const titleEl = root.querySelector('title');
  const title = titleEl ? titleEl.textContent.trim() : '';

  // Meta description
  const metaDescEl = root.querySelector('meta[name="description"]');
  const metaDescription = metaDescEl ? (metaDescEl.getAttribute('content') || '') : '';

  // Meta keywords
  const metaKeywordsEl = root.querySelector('meta[name="keywords"]');
  const metaKeywordsRaw = metaKeywordsEl ? (metaKeywordsEl.getAttribute('content') || '') : '';
  const metaKeywords = metaKeywordsRaw
    ? metaKeywordsRaw.split(',').map(k => k.trim()).filter(Boolean)
    : [];

  // Image alt text
  const images = root.querySelectorAll('img');
  const totalImages = images.length;
  let imagesWithAlt = 0;
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (alt !== null && alt !== '') imagesWithAlt++;
  });
  const imagesMissingAlt = totalImages - imagesWithAlt;

  // Top words
  const topWords = getTopWords(root);

  return {
    title,
    titleLength: title.length,
    metaDescription,
    metaDescriptionLength: metaDescription.length,
    metaKeywords,
    keywordCount: metaKeywords.length,
    totalImages,
    imagesWithAlt,
    imagesMissingAlt,
    topWords
  };
}

// Most frequent words (top 10)
function getTopWords(root) {
  // Get elements that likely contain main content
  const contentElements = root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');

  // Remove HTML tags and scripts/styles, then join text
  const contentText = Array.from(contentElements).map(el =>
    el.innerHTML
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).join(' ').toLowerCase();

  // Extract words
  const words = contentText.match(/[a-z]{3,}/g) || [];

  // Remove stopwords ("and", "or", etc)
  const filtered = removeStopwords(words);

  // Count the words
  const wordFreq = {};
  filtered.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Get top 10 words
  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return topWords;
}

module.exports = { analyzeSEO };