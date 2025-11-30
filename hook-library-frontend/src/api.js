const API_BASE = "http://localhost:8000/api";

// ---- Authentication ----
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function register(email, password, username) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username })
  });
  return res.json();
}

// ---- Reddit Scraper ----
export async function scrapeReddit(subreddit, limit = 50) {
  const res = await fetch(`${API_BASE}/reddit/scrape?subreddit=${subreddit}&limit=${limit}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function scrapeRedditAll() {
  const res = await fetch(`${API_BASE}/reddit/scrape-all`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function getRedditHooks() {
  const res = await fetch(`${API_BASE}/reddit/hooks`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

// ---- YouTube Scraper ----
export async function scrapeYoutube(channelId, limit = 10) {
  const res = await fetch(`${API_BASE}/youtube/scrape?channel_id=${channelId}&limit=${limit}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function scrapeYoutubeAll() {
  const res = await fetch(`${API_BASE}/youtube/scrape-all`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

// ---- Instagram Scraper ----
export async function scrapeInstagram(username, limit = 5) {
  const res = await fetch(`${API_BASE}/instagram/scrape?username=${username}&limit=${limit}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function scrapeInstagramAll() {
  const res = await fetch(`${API_BASE}/instagram/scrape-all`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

// ---- Profile ----
export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function getProfileStats() {
  const res = await fetch(`${API_BASE}/profile/stats/quick`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ---- Collections ----
export async function getCollections() {
  const res = await fetch(`${API_BASE}/profile/collections`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function createCollection(name) {
  const res = await fetch(`${API_BASE}/profile/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ name })
  });
  return res.json();
}

// ---- Settings & Reports ----
export async function getUserSettings() {
  const res = await fetch(`${API_BASE}/settings`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function updateUserSettings(data) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getWeeklyReport() {
  const res = await fetch(`${API_BASE}/reports/weekly`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function getMonthlyReport() {
  const res = await fetch(`${API_BASE}/reports/monthly`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

export async function exportReport(reportType, format = 'csv') {
  const res = await fetch(`${API_BASE}/reports/download/${reportType}?format=${format}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.blob();
}

// ---- AI Generation ----
export async function generateHooksWithAI(prompt, count = 5) {
  const res = await fetch(`${API_BASE}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ prompt, count })
  });
  return res.json();
}

export async function getAICredits() {
  const res = await fetch(`${API_BASE}/ai/credits`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return res.json();
}

// ---- Export as api object ----
export const api = {
  auth: { login, register },
  reddit: { scrapeReddit, scrapeRedditAll, getRedditHooks },
  youtube: { scrapeYoutube, scrapeYoutubeAll },
  instagram: { scrapeInstagram, scrapeInstagramAll },
  profile: { getProfile, getProfileStats, updateProfile },
  collections: { getCollections, createCollection },
  settings: { getUserSettings, updateUserSettings },
  reports: { getWeeklyReport, getMonthlyReport, exportReport },
  ai: { generateHooksWithAI, getAICredits }
;
