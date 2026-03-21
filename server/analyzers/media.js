function analyzeMedia(root) {
  const images = root.querySelectorAll('img');
  const videos = root.querySelectorAll('video');

  let missingAlt = 0;
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (alt === null || alt === '') missingAlt++;
  });

  return {
    imageCount: images.length,
    videoCount: videos.length,
    missingAlt,
  };
}

module.exports = { analyzeMedia };