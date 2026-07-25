const API_BASE = "http://localhost:8000/api/v1";

export async function ingestLogs(payload: any) {
  const response = await fetch(`${API_BASE}/ingest/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([payload]) // Backend expects list of records
  });
  if (!response.ok) throw new Error(`Ingestion failed with status ${response.status}`);
  return response.json();
}

export async function fetchBaseline(username: string) {
  const response = await fetch(`${API_BASE}/baseline/${username}`);
  if (!response.ok) throw new Error(`Baseline not found for ${username}`);
  return response.json();
}

export async function recalculateBaseline(username: string, events: any[]) {
  const response = await fetch(`${API_BASE}/baseline/${username}/recalculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events)
  });
  if (!response.ok) throw new Error(`Recalculation failed for ${username}`);
  return response.json();
}

export async function analyzeAnomaly(payload: any) {
  const response = await fetch(`${API_BASE}/anomaly/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Anomaly analysis failed");
  return response.json();
}

export async function explainThreat(payload: any) {
  const response = await fetch(`${API_BASE}/copilot/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Copilot analysis failed");
  return response.json();
}
