const API_BASE = "http://localhost:8000";

// ---- Test API ----
export async function testConnection() {
  const res = await fetch(`${API_BASE}/api/test`);
  return res.json();
}

// ---- Example: Fetch Hooks ----
export async function fetchHooks() {
  const res = await fetch(`${API_BASE}/api/hooks`);
  return res.json();
}

// ---- Export as api object ----
export const api = {
  testConnection,
  fetchHooks,
};
