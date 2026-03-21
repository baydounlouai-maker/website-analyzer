const SOCIAL_DOMAINS = ['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'tiktok.com'];

function analyzeLinks(root, baseUrl) {
  const baseOrigin = new URL(baseUrl).origin;
  const anchors = root.querySelectorAll('a[href]');

  const internal = [];
  const external = [];
  const social = [];

  anchors.forEach(a => {
    const href = a.getAttribute('href') || '';

    if (!href) return;

    let fullUrl;
    try {
      fullUrl = href.startsWith('http') ? href : new URL(href, baseUrl).href;
    } catch {
      return;
    }

    const isSocial = SOCIAL_DOMAINS.some(domain => fullUrl.includes(domain));
    if (isSocial) social.push(fullUrl);

    if (fullUrl.startsWith(baseOrigin)) {
      internal.push(fullUrl);
    } else {
      external.push(fullUrl);
    }
  });

  return {
    internalCount: internal.length,
    externalCount: external.length,
    socialCount: social.length,
    socialLinks: social,
  };
}

module.exports = { analyzeLinks };