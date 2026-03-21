function analyzePerformance(root, size) {
  const sizeKB = size / 1024;

  const scripts = root.querySelectorAll('script[src]');
  const cssFiles = root.querySelectorAll('link[rel="stylesheet"]');
  const images = root.querySelectorAll('img');
  const lazyImages = root.querySelectorAll('img[loading="lazy"]');

  return {
    pageSizeBytes: size,
    pageSizeKB: sizeKB,
    scriptCount: scripts.length,
    cssCount: cssFiles.length,
    imageCount: images.length,
    lazyImageCount: lazyImages.length
  };
}

module.exports = { analyzePerformance };