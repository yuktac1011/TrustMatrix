"use client";
import { useState } from "react";
import {
  Shield, Lock, KeyRound, Smartphone, Ban, FolderX, ClipboardList,
  CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp
} from "lucide-react";
import {
  isolateHost, lockUser, revokeTokens, forceMFA,
  blockIP, quarantineFile, fetchAuditLog
} from "../../lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RemediationResult {
  action: string;
  status: string;
  target: string;
  triggered_by_incident?: string;
  analyst: string;
  executed_at: string;
  playbook_steps: string[];
  audit_log_id: string;
  notes: string;
  integration_targets: string[];
}

interface AuditEntry {
  audit_log_id: string;
  action: string;
  target: string;
  analyst: string;
  incident_id?: string;
  executed_at: string;
  status: string;
  notes: string;
}

// ── Action Card ───────────────────────────────────────────────────────────────
function ActionCard({
  icon: Icon,
  title,
  description,
  color,
  fields,
  onSubmit,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  fields: { name: string; label: string; placeholder: string; type?: string }[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RemediationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handle = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await onSubmit(values);
      setResult(data as unknown as RemediationResult);
      setExpanded(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const statusColor =
    result?.status === "EXECUTED"
      ? "text-[#86efac]"
      : result?.status === "ALREADY_APPLIED"
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4 bg-[#01021a] border-[#172554]">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-[#111827]" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-zinc-400">{description}</div>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-2">
        {fields.map((f) => (
          <input
            key={f.name}
            type={f.type || "text"}
            placeholder={f.placeholder}
            value={values[f.name] || ""}
            onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
            className="w-full bg-[#111827] border border-[#172554] rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#86efac]"
          />
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-[#111827] transition-all disabled:opacity-50 bg-[#86efac] hover:bg-[#86efac]/90 glow-primary"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
        {loading ? "Executing…" : `Execute Playbook`}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="border border-[#172554] rounded-xl overflow-hidden bg-[#111827]">
          {/* Status bar */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-[#172554] bg-[#01021a]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${statusColor}`} />
              <span className={`text-sm font-bold ${statusColor}`}>{result.status}</span>
              <span className="text-xs text-zinc-400">→ {result.target}</span>
            </div>
            <button
              onClick={() => setExpanded((p) => !p)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expanded && (
            <div className="px-4 py-3 space-y-3">
              <p className="text-xs text-zinc-300">{result.notes}</p>

              {/* Playbook Steps */}
              <div className="space-y-1">
                {result.playbook_steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-[#86efac] shrink-0">▸</span>
                    <span className="text-zinc-300 font-mono">{step}</span>
                  </div>
                ))}
              </div>

              {/* Integration targets */}
              <div className="flex flex-wrap gap-1 pt-1">
                {result.integration_targets.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/30 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Audit Log ─────────────────────────────────────────────────────────────────
function AuditLogPanel() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLog();
      setLogs(data.logs || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4 bg-[#01021a] border-[#172554]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#86efac]" />
          <span className="text-sm font-semibold text-white">SOAR Audit Log</span>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#172554] text-[#86efac] border border-[#172554] transition-colors font-medium"
        >
          {loading ? "Loading…" : "Refresh Audit Log"}
        </button>
      </div>

      {logs.length === 0 ? (
        <p className="text-xs text-zinc-500 text-center py-4">No actions executed yet. Run a playbook above.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.audit_log_id} className="px-4 py-3 rounded-xl bg-[#111827] border border-[#172554] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white capitalize">{log.action.replace(/_/g, " ")}</span>
                <span className={`font-bold ${log.status === "EXECUTED" ? "text-[#86efac]" : "text-amber-400"}`}>{log.status}</span>
              </div>
              <div className="text-xs text-zinc-400">
                Target: <span className="text-zinc-200 font-mono">{log.target}</span>
                &nbsp;·&nbsp; Analyst: {log.analyst}
              </div>
              <div className="text-xs text-zinc-500">{log.notes}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SOARTab() {
  const actions = [
    {
      icon: Shield,
      title: "Isolate Host",
      description: "Quarantine a compromised workstation from the network",
      color: "bg-[#86efac]",
      fields: [
        { name: "hostname", label: "Hostname", placeholder: "e.g. WORKSTATION-JDOE-01" },
        { name: "reason", label: "Reason", placeholder: "Reason for isolation" },
        { name: "triggered_by_incident", label: "Incident ID", placeholder: "Optional incident ID" },
        { name: "analyst", label: "Analyst", placeholder: "Your username" },
      ],
      onSubmit: (v: Record<string, string>) =>
        isolateHost({ hostname: v.hostname, reason: v.reason, triggered_by_incident: v.triggered_by_incident, analyst: v.analyst }),
    },
    {
      icon: Lock,
      title: "Lock User Account",
      description: "Disable account across Active Directory & Okta IAM",
      color: "bg-[#38bdf8]",
      fields: [
        { name: "username", label: "Username", placeholder: "e.g. jdoe" },
        { name: "reason", label: "Reason", placeholder: "Reason for locking" },
        { name: "triggered_by_incident", label: "Incident ID", placeholder: "Optional incident ID" },
        { name: "analyst", label: "Analyst", placeholder: "Your username" },
      ],
      onSubmit: (v: Record<string, string>) =>
        lockUser({ username: v.username, reason: v.reason, triggered_by_incident: v.triggered_by_incident, analyst: v.analyst }),
    },
    {
      icon: KeyRound,
      title: "Revoke OAuth Tokens",
      description: "Invalidate all active sessions and refresh tokens",
      color: "bg-[#a78bfa]",
      fields: [
        { name: "username", label: "Username", placeholder: "e.g. jdoe" },
        { name: "reason", label: "Reason", placeholder: "Reason for revocation" },
        { name: "analyst", label: "Analyst", placeholder: "Your username" },
      ],
      onSubmit: (v: Record<string, string>) =>
        revokeTokens({ username: v.username, reason: v.reason, analyst: v.analyst }),
    },
    {
      icon: Smartphone,
      title: "Force Step-Up MFA",
      description: "Enforce MFA challenge on next login via Okta / Azure AD",
      color: "bg-[#86efac]",
      fields: [
        { name: "username", label: "Username", placeholder: "e.g. jdoe" },
        { name: "mfa_level", label: "MFA Method", placeholder: "TOTP / SMS / HARDWARE_KEY" },
        { name: "reason", label: "Reason", placeholder: "Reason for MFA enforcement" },
        { name: "analyst", label: "Analyst", placeholder: "Your username" },
      ],
      onSubmit: (v: Record<string, string>) =>
        forceMFA({ username: v.username, mfa_level: v.mfa_level, reason: v.reason, analyst: v.analyst }),
    },
    {
      icon: Ban,
      title: "Block IP Address",
      description: "Push DENY rule to firewall, AWS SGs, and Cloudflare WAF",
      color: "bg-red-400",
      fields: [
        { name: "ip_address", label: "IP Address", placeholder: "e.g. 203.0.113.120" },
        { name: "reason", label: "Reason", placeholder: "Reason for IP block" },
        { name: "analyst", label: "Analyst", placeholder: "Your username" },
      ],
      onSubmit: (v: Record<string, string>) =>
        blockIP({ ip_address: v.ip_address, reason: v.reason, analyst: v.analyst }),
    },
    {
      icon: FolderX,
      title: "Quarantine File",
      description: "Move suspicious file to isolated quarantine via EDR RTR",
      color: "bg-amber-400",
      fields: [
        { name: "file_path", label: "File Path", placeholder: "e.g. C:\\Users\\jdoe\\mimikatz.exe" },
        { name: "hostname", label: "Hostname", placeholder: "e.g. WORKSTATION-JDOE-01" },
        { name: "reason", label: "Reason", placeholder: "Reason for quarantine" },
        { name: "analyst", label: "Analyst", placeholder: "Your username" },
      ],
      onSubmit: (v: Record<string, string>) =>
        quarantineFile({ file_path: v.file_path, hostname: v.hostname, reason: v.reason, analyst: v.analyst }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 bg-[#01021a] border-[#172554]">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-[#86efac]" />
          <h2 className="text-xl font-bold text-white">SOAR Remediation Playbooks</h2>
          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/30 font-semibold">
            6 Active Playbooks
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          One-click Security Orchestration, Automation and Response (SOAR) playbooks. Each action executes
          a detailed remediation sequence and generates a full audit log with integration targets for production wiring.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </div>

      {/* Audit Log */}
      <AuditLogPanel />
    </div>
  );
}

