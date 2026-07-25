const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ── Helper ────────────────────────────────────────────────────────────────────
async function apiPost(endpoint: string, body: unknown) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Request failed: ${response.status}`);
  }
  return response.json();
}

async function apiGet(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

// ── Phase 1 Existing APIs ─────────────────────────────────────────────────────

export async function ingestLogs(payload: unknown) {
  return apiPost("/ingest/", [payload]);
}

export async function fetchBaseline(username: string) {
  return apiGet(`/baseline/${username}`);
}

export async function recalculateBaseline(username: string, events: unknown[]) {
  return apiPost(`/baseline/${username}/recalculate`, events);
}

export async function analyzeAnomaly(payload: unknown) {
  return apiPost("/anomaly/analyze", payload);
}

export async function explainThreat(payload: unknown) {
  return apiPost("/copilot/explain", payload);
}

// ── Phase 2: NLP Topic Engine ─────────────────────────────────────────────────

export async function analyzeTopics(payload: {
  username: string;
  target_documents: string[];
  corpus_documents?: string[];
  n_topics?: number;
}) {
  return apiPost("/nlp/analyze-topics", payload);
}

// ── Phase 2: CERT Benchmark Evaluator ────────────────────────────────────────

export async function runDemoBenchmark() {
  return apiGet("/benchmark/demo");
}

export async function runBenchmark(payload: {
  log_entries: unknown[];
  top_percent_thresholds?: number[];
  contamination?: number;
}) {
  return apiPost("/benchmark/evaluate", payload);
}

// ── Phase 2: SOAR Remediation ─────────────────────────────────────────────────

export async function isolateHost(payload: {
  hostname: string;
  reason: string;
  triggered_by_incident?: string;
  analyst?: string;
}) {
  return apiPost("/remediation/isolate-host", payload);
}

export async function lockUser(payload: {
  username: string;
  reason: string;
  triggered_by_incident?: string;
  analyst?: string;
  lock_duration_hours?: number;
}) {
  return apiPost("/remediation/lock-user", payload);
}

export async function revokeTokens(payload: {
  username: string;
  reason: string;
  triggered_by_incident?: string;
  analyst?: string;
}) {
  return apiPost("/remediation/revoke-tokens", payload);
}

export async function forceMFA(payload: {
  username: string;
  mfa_level?: string;
  reason: string;
  triggered_by_incident?: string;
  analyst?: string;
}) {
  return apiPost("/remediation/force-mfa", payload);
}

export async function blockIP(payload: {
  ip_address: string;
  reason: string;
  triggered_by_incident?: string;
  analyst?: string;
}) {
  return apiPost("/remediation/block-ip", payload);
}

export async function quarantineFile(payload: {
  file_path: string;
  hostname: string;
  reason: string;
  triggered_by_incident?: string;
  analyst?: string;
}) {
  return apiPost("/remediation/quarantine-file", payload);
}

export async function fetchAuditLog() {
  return apiGet("/remediation/audit-log");
}
