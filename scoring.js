// ── NeilHunter Lead Scoring ──────────────────────────────
const Scoring = (() => {
  const OUTDATED = ['wix.com','weebly.com','jimdo.com','wordpress.com','blogspot.com','squarespace.com','godaddy.com/website','yolasite.com','webnode.com','site123.com','strikingly.com'];

  function detectWebsiteStatus(url) {
    if (!url) return 'NONE';
    const u = url.toLowerCase();
    if (OUTDATED.some(d => u.includes(d))) return 'OUTDATED';
    return 'MODERN';
  }

  function calculate({ phone, address, rating, reviewCount, website, hours }) {
    let score = 0;
    const status = detectWebsiteStatus(website);
    if (status === 'NONE')     score += 40;
    else if (status === 'OUTDATED') score += 25;
    if (!phone)   score += 10;
    if (!address) score += 5;
    if (rating && rating < 3.5) score += 20;
    else if (!rating)           score += 15;
    if (!reviewCount || reviewCount === 0) score += 20;
    else if (reviewCount < 10)             score += 15;
    else if (reviewCount < 30)             score += 8;
    if (!hours) score += 5;
    return Math.min(100, score);
  }

  function label(score) {
    if (score >= 75) return 'Hot Lead';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }

  function color(score) {
    if (score >= 75) return '#f87171';
    if (score >= 60) return '#fbbf24';
    if (score >= 40) return '#14b8a6';
    return '#8892a4';
  }

  function oppBadgeClass(score) {
    if (score >= 75) return 'hot';
    if (score >= 60) return 'high';
    return 'low';
  }

  return { calculate, detectWebsiteStatus, label, color, oppBadgeClass };
})();
