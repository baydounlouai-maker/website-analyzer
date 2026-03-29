const API_URL = 'http://localhost:3000/api/analyze';

document.getElementById('analyzeBtn').addEventListener('click', runAnalysis);
document.getElementById('urlInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runAnalysis();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'visualized' && lastData) {
      renderCharts(lastData);
    }
  });
});

let lastData = null;
let chartInstances = {};

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
  lastData = data;
  const { seo, performance, content, links, media, scores } = data;

  // Reset to Results tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="results"]').classList.add('active');
  document.getElementById('tab-results').classList.add('active');

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

function renderCharts(data) {
  const { seo, performance, links, scores } = data;

  // Destroy existing charts before re-rendering
  Object.values(chartInstances).forEach(c => c.destroy());
  chartInstances = {};

  // Scores bar chart
  chartInstances.scores = new Chart(document.getElementById('chartScores'), {
    type: 'bar',
    data: {
      labels: ['SEO Score', 'Performance', 'Overall'],
      datasets: [{
        data: [scores.seoScore, scores.performanceScore, scores.overall],
        backgroundColor: [
          scoreChartColor(scores.seoScore),
          scoreChartColor(scores.performanceScore),
          scoreChartColor(scores.overall)
        ],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 100 } },
      plugins: { legend: { display: false } }
    }
  });

  // Link distribution doughnut
  chartInstances.links = new Chart(document.getElementById('chartLinks'), {
    type: 'doughnut',
    data: {
      labels: ['Internal', 'External', 'Social'],
      datasets: [{
        data: [links.internalCount, links.externalCount, links.socialCount],
        backgroundColor: ['#2e7bf6', '#27ae60', '#e67e22']
      }]
    },
    options: { responsive: true }
  });

  // Alt text coverage doughnut
  const missingAlt = seo.totalImages - seo.imagesWithAlt;
  chartInstances.alt = new Chart(document.getElementById('chartAlt'), {
    type: 'doughnut',
    data: {
      labels: ['Has Alt Text', 'Missing Alt Text'],
      datasets: [{
        data: [seo.imagesWithAlt, missingAlt < 0 ? 0 : missingAlt],
        backgroundColor: ['#27ae60', '#e74c3c']
      }]
    },
    options: { responsive: true }
  });

  // Page resources bar chart
  chartInstances.resources = new Chart(document.getElementById('chartResources'), {
    type: 'bar',
    data: {
      labels: ['Scripts', 'CSS Files', 'Images'],
      datasets: [{
        data: [performance.scriptCount, performance.cssCount, performance.imageCount],
        backgroundColor: ['#2e7bf6', '#9b59b6', '#e67e22'],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

function scoreChartColor(value) {
  if (value >= 80) return '#27ae60';
  if (value >= 50) return '#e67e22';
  return '#e74c3c';
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
