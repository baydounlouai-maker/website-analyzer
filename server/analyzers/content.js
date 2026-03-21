function analyzeContent(root) {
  const bodyEl = root.querySelector('body');
  const bodyText = bodyEl ? bodyEl.textContent.trim() : '';

  const words = bodyText.split(" ").filter(w => w.length > 0);
  const wordCount = words.length;
  const readingTimeInMinutes = Math.ceil(wordCount / 200);

  return {
    wordCount,
    readingTimeInMinutes,
  };
}

module.exports = { analyzeContent };