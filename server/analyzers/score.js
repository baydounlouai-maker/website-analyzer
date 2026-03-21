function computeScores(seo, performance) {
  // --- SEO Score (start at 100, deduct for issues) ---
  let seoScore = 100;

  if (!seo.title) seoScore -= 20;
  else if (seo.titleLength < 10 || seo.titleLength > 60) seoScore -= 10;

  if (!seo.metaDescription) seoScore -= 20;
  else if (seo.metaDescriptionLength < 50 || seo.metaDescriptionLength > 160) seoScore -= 10;

  if (!seo.canonical) seoScore -= 10;
  if (seo.keywordCount === 0) seoScore -= 10;

  if (seo.totalImages > 0) {
    const missingAltRatio = seo.imagesMissingAlt / seo.totalImages;
    if (missingAltRatio > 0.2) seoScore -= 20;
  }

  // --- Performance Score (start at 100, deduct for issues) ---
  let perfScore = 100;

  if (performance.pageSizeKB > 200) perfScore -= 30;
  else if (performance.pageSizeKB > 100) perfScore -= 15;

  if (performance.scriptCount > 6) perfScore -= 30;
  else if (performance.scriptCount > 3) perfScore -= 15;

  if (performance.cssCount > 5) perfScore -= 20;
  else if (performance.cssCount > 3) perfScore -= 10;

  if (performance.imageCount > 3 && performance.lazyImageCount === 0) perfScore -= 20;

  // Clamp to [0, 100]
  seoScore = Math.max(0, Math.min(100, seoScore));
  perfScore = Math.max(0, Math.min(100, perfScore));

  const overall = Math.round((seoScore + perfScore) / 2);
  const grade = (overall / 10).toFixed(1);

  return {
    seoScore,
    performanceScore: perfScore,
    overall,
    grade
  };
}

module.exports = { computeScores };
