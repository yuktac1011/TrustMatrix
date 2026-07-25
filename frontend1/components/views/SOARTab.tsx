"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface ActionField {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}

interface ActionConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  fields: ActionField[];
  initialValues: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

function formatApiError(e: unknown): string {
  if (!(e instanceof Error)) return "Action failed";
  try {
    const parsed = JSON.parse(e.message);
    if (parsed.detail && Array.isArray(parsed.detail)) {
      const fields = parsed.detail
        .map((d: { loc?: string[]; msg?: string }) => d.loc?.[d.loc.length - 1] || d.msg)
        .filter(Boolean);
      return `Please fill in all required fields: ${fields.join(", ")}`;
    }
  } catch {
    // Not JSON
  }
  return e.message;
}

// ── Action Card ───────────────────────────────────────────────────────────────
function ActionCard({
  icon: Icon,
  title,
  description,
  color,
  fields,
  initialValues,
  onSubmit,
}: ActionConfig) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [result, setResult] = useState<RemediationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handle = async () => {
    setError("");
    setResult(null);

    // Pre-validation check for required fields
    const missing = fields
      .filter((f) => f.required !== false && (!values[f.name] || !values[f.name].trim()))
      .map((f) => f.label);

    if (missing.length > 0) {
      setError(`Please fill in required fields: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const data = await onSubmit(values);
      setResult(data as unknown as RemediationResult);
      setExpanded(true);
    } catch (e: unknown) {
      setError(formatApiError(e));
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
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="glass-panel rounded-2xl p-5 space-y-4 bg-[#01021a] border-[#172554] shadow-md flex flex-col justify-between"
    >
      <div className="space-y-4">
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
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="font-semibold text-zinc-400 uppercase tracking-wider">{f.label}</span>
                {f.required !== false && <span className="text-[#86efac] font-bold">*Required</span>}
              </div>
              <input
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={values[f.name] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                className="w-full bg-[#111827] border border-[#172554] rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#86efac] font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-[#111827] transition-all disabled:opacity-50 bg-[#86efac] hover:bg-[#86efac]/90 glow-primary cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {loading ? "Executing…" : `Execute Playbook`}
        </motion.button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-2.5 font-mono"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border border-[#172554] rounded-xl overflow-hidden bg-[#111827]"
          >
            {/* Status bar */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#172554] bg-[#01021a]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${statusColor}`} />
                <span className={`text-sm font-bold font-mono ${statusColor}`}>{result.status}</span>
                <span className="text-xs text-zinc-400 font-mono">→ {result.target}</span>
              </div>
              <button
                onClick={() => setExpanded((p) => !p)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-3 space-y-3"
                >
                  <p className="text-xs text-zinc-300">{result.notes}</p>

                  {/* Playbook Steps */}
                  <div className="space-y-1">
                    {result.playbook_steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 text-xs"
                      >
                        <span className="text-[#86efac] shrink-0">▸</span>
                        <span className="text-zinc-300 font-mono">{step}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Integration targets */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {result.integration_targets.map((t) => (
                      <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/30 font-mono font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={load}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#172554] text-[#86efac] border border-[#172554] transition-colors font-medium cursor-pointer"
        >
          {loading ? "Loading…" : "Refresh Audit Log"}
        </motion.button>
      </div>

      {logs.length === 0 ? (
        <p className="text-xs text-zinc-500 text-center py-4 font-mono">No actions executed yet. Run a playbook above.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {logs.map((log) => (
            <motion.div
              key={log.audit_log_id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl bg-[#111827] border border-[#172554] space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white capitalize">{log.action.replace(/_/g, " ")}</span>
                <span className={`font-bold font-mono ${log.status === "EXECUTED" ? "text-[#86efac]" : "text-amber-400"}`}>{log.status}</span>
              </div>
              <div className="text-xs text-zinc-400">
                Target: <span className="text-zinc-200 font-mono">{log.target}</span>
                &nbsp;·&nbsp; Analyst: {log.analyst}
              </div>
              <div className="text-xs text-zinc-500 font-mono">{log.notes}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SOARTab() {
  const actions: ActionConfig[] = [
    {
      icon: Shield,
      title: "Isolate Host",
      description: "Quarantine a compromised workstation from the network",
      color: "bg-[#86efac]",
      fields: [
        { name: "hostname", label: "Hostname", placeholder: "e.g. WORKSTATION-JDOE-01", required: true },
        { name: "reason", label: "Reason", placeholder: "Reason for isolation", required: true },
        { name: "triggered_by_incident", label: "Incident ID", placeholder: "Optional incident ID", required: false },
        { name: "analyst", label: "Analyst", placeholder: "Your username", required: true },
      ],
      initialValues: {
        hostname: "WORKSTATION-JDOE-01",
        reason: "Suspicious lateral data exfiltration detected",
        triggered_by_incident: "INC-2026-8891",
        analyst: "admin_user",
      },
      onSubmit: (v: Record<string, string>) =>
        isolateHost({ hostname: v.hostname, reason: v.reason, triggered_by_incident: v.triggered_by_incident, analyst: v.analyst }),
    },
    {
      icon: Lock,
      title: "Lock User Account",
      description: "Disable account across Active Directory & Okta IAM",
      color: "bg-[#38bdf8]",
      fields: [
        { name: "username", label: "Username", placeholder: "e.g. jdoe", required: true },
        { name: "reason", label: "Reason", placeholder: "Reason for locking", required: true },
        { name: "triggered_by_incident", label: "Incident ID", placeholder: "Optional incident ID", required: false },
        { name: "analyst", label: "Analyst", placeholder: "Your username", required: true },
      ],
      initialValues: {
        username: "admin_user",
        reason: "Compromised credential anomaly alert",
        triggered_by_incident: "INC-2026-8891",
        analyst: "admin_user",
      },
      onSubmit: (v: Record<string, string>) =>
        lockUser({ username: v.username, reason: v.reason, triggered_by_incident: v.triggered_by_incident, analyst: v.analyst }),
    },
    {
      icon: KeyRound,
      title: "Revoke OAuth Tokens",
      description: "Invalidate all active sessions and refresh tokens",
      color: "bg-[#a78bfa]",
      fields: [
        { name: "username", label: "Username", placeholder: "e.g. jdoe", required: true },
        { name: "reason", label: "Reason", placeholder: "Reason for revocation", required: true },
        { name: "analyst", label: "Analyst", placeholder: "Your username", required: true },
      ],
      initialValues: {
        username: "admin_user",
        reason: "Session hijack containment protocol",
        analyst: "admin_user",
      },
      onSubmit: (v: Record<string, string>) =>
        revokeTokens({ username: v.username, reason: v.reason, analyst: v.analyst }),
    },
    {
      icon: Smartphone,
      title: "Force Step-Up MFA",
      description: "Enforce MFA challenge on next login via Okta / Azure AD",
      color: "bg-[#86efac]",
      fields: [
        { name: "username", label: "Username", placeholder: "e.g. jdoe", required: true },
        { name: "mfa_level", label: "MFA Method", placeholder: "TOTP / SMS / HARDWARE_KEY", required: true },
        { name: "reason", label: "Reason", placeholder: "Reason for MFA enforcement", required: true },
        { name: "analyst", label: "Analyst", placeholder: "Your username", required: true },
      ],
      initialValues: {
        username: "admin_user",
        mfa_level: "TOTP",
        reason: "Anomalous geographic login location",
        analyst: "admin_user",
      },
      onSubmit: (v: Record<string, string>) =>
        forceMFA({ username: v.username, mfa_level: v.mfa_level, reason: v.reason, analyst: v.analyst }),
    },
    {
      icon: Ban,
      title: "Block IP Address",
      description: "Push DENY rule to firewall, AWS SGs, and Cloudflare WAF",
      color: "bg-red-400",
      fields: [
        { name: "ip_address", label: "IP Address", placeholder: "e.g. 203.0.113.120", required: true },
        { name: "reason", label: "Reason", placeholder: "Reason for IP block", required: true },
        { name: "analyst", label: "Analyst", placeholder: "Your username", required: true },
      ],
      initialValues: {
        ip_address: "203.0.113.120",
        reason: "Command and Control server IP match",
        analyst: "admin_user",
      },
      onSubmit: (v: Record<string, string>) =>
        blockIP({ ip_address: v.ip_address, reason: v.reason, analyst: v.analyst }),
    },
    {
      icon: FolderX,
      title: "Quarantine File",
      description: "Move suspicious file to isolated quarantine via EDR RTR",
      color: "bg-amber-400",
      fields: [
        { name: "file_path", label: "File Path", placeholder: "e.g. C:\\Users\\jdoe\\mimikatz.exe", required: true },
        { name: "hostname", label: "Hostname", placeholder: "e.g. WORKSTATION-JDOE-01", required: true },
        { name: "reason", label: "Reason", placeholder: "Reason for quarantine", required: true },
        { name: "analyst", label: "Analyst", placeholder: "Your username", required: true },
      ],
      initialValues: {
        file_path: "C:\\Users\\admin_user\\mimikatz.exe",
        hostname: "WORKSTATION-JDOE-01",
        reason: "Credential dumping tool binary detected",
        analyst: "admin_user",
      },
      onSubmit: (v: Record<string, string>) =>
        quarantineFile({ file_path: v.file_path, hostname: v.hostname, reason: v.reason, analyst: v.analyst }),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 bg-[#01021a] border-[#172554]">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-[#86efac]" />
          <h2 className="text-xl font-bold text-white">SOAR Remediation Playbooks</h2>
          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/30 font-semibold font-mono">
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
    </motion.div>
  );
}
