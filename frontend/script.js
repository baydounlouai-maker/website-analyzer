const API_URL = 'http://localhost:3000/api/analyze';

document.getElementById('analyzeBtn').addEventListener('click', runAnalysis);
document.getElementById('urlInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runAnalysis();
});

async function runAnalysis() {
  const url = document.getElementById('urlInput').value.trim();

  if (!url) {
    showError('Please enter a URL.');
    return;
  }

  showSpinner();
  hideError();
  hideDashboard();

  try {
    // Connects frontend to backend
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error || 'Something went wrong.');
      return;
    }

    renderDashboard(data);
  } catch (err) {
    showError('Could not connect to the server. Make sure it is running on port 3000.');
  } finally {
    hideSpinner();
  }
}

function renderDashboard(data) {
  const { seo, performance, content, links, media, scores } = data;

  // SEO
  setText('seoTitle', seo.title || '(none)');
  setText('seoTitleLength', seo.titleLength + ' chars');
  setText('seoMetaDesc', seo.metaDescription ? 'Present' : 'Missing');
  setText('seoMetaDescLength', seo.metaDescriptionLength + ' chars');
  setText('seoKeywords', seo.keywordCount > 0 ? seo.keywordCount + ' keywords' : 'None');
  setText('seoAlt', seo.imagesWithAlt + ' / ' + seo.totalImages);

  if (seo.topWords && seo.topWords.length > 0) {
    const section = document.getElementById('topWordsSection');
    const list = document.getElementById('topWordsList');
    list.innerHTML = '';
    seo.topWords.forEach(({ word, count }) => {
      const li = document.createElement('li');
      li.textContent = word + ' (' + count + ')';
      list.appendChild(li);
    });
    section.classList.remove('hidden');
  }

  // Performance
  setText('perfSize', Number(performance.pageSizeKB).toFixed(2) + ' KB');
  setText('perfScripts', performance.scriptCount);
  setText('perfCSS', performance.cssCount);
  setText('perfImages', performance.imageCount);
  setText('perfLazy', performance.lazyImageCount);

  // Content
  setText('contentWords', content.wordCount.toLocaleString() + ' words');
  setText('contentReading', content.readingTimeInMinutes + ' min');

  // Links
  setText('linksInternal', links.internalCount);
  setText('linksExternal', links.externalCount);
  setText('linksSocial', links.socialCount);

  // Media
  setText('mediaImages', media.imageCount);
  setText('mediaVideos', media.videoCount);
  setText('mediaMissingAlt', media.missingAlt);

  // Scores
  setScore('scoreSEO', scores.seoScore);
  setScore('scorePerf', scores.performanceScore);
  setScore('scoreOverall', scores.overall);
  document.getElementById('scoreGrade').textContent = scores.grade + ' / 10';

  showDashboard();
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function setScore(id, value) {
  const el = document.getElementById(id);
  el.textContent = value;
  el.className = 'score-value ' + scoreColor(value);
}

function scoreColor(value) {
  if (value >= 80) return 'green';
  if (value >= 50) return 'orange';
  return 'red';
}

function showSpinner() { document.getElementById('spinner').classList.remove('hidden'); }
function hideSpinner() { document.getElementById('spinner').classList.add('hidden'); }
function showDashboard() { document.getElementById('dashboard').classList.remove('hidden'); }
function hideDashboard() { document.getElementById('dashboard').classList.add('hidden'); }
function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.classList.remove('hidden');
}
function hideError() { document.getElementById('error').classList.add('hidden'); }