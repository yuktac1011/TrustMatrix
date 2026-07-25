"use client";
import { useState } from "react";
import { Brain, Search, Tag, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { analyzeTopics } from "../../lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface TopicVector {
  document: string;
  topic_distribution: number[];
  dominant_topic: number;
  dominant_topic_probability: number;
}

interface TopicResult {
  username: string;
  n_topics: number;
  corpus_size: number;
  topic_keywords: string[][];
  document_vectors: TopicVector[];
  anomalous_documents: string[];
  anomaly_score: number;
  is_topic_anomaly: boolean;
  baseline_topics: number[];
  flagged_topics: number[];
}

// ── Demo Data ─────────────────────────────────────────────────────────────────
const DEMO_CORPUS = [
  "quarterly_budget_q4_2026.xlsx",
  "employee_payroll_march.csv",
  "invoice_vendor_payment.pdf",
  "expense_report_travel.xlsx",
  "annual_financial_audit.pdf",
  "accounts_receivable_jan.xlsx",
  "tax_filing_corporate_2026.pdf",
  "budget_forecast_hr.csv",
  "cost_center_report_finance.pdf",
  "purchase_order_supplier.xlsx",
];

const DEMO_TARGETS_NORMAL = [
  "q1_budget_revision.xlsx",
  "payroll_corrections_april.csv",
  "vendor_invoice_march.pdf",
];

const DEMO_TARGETS_ANOMALOUS = [
  "mimikatz_credential_dump.exe",
  "kernel_exploit_cve2026.py",
  "shadow_copy_delete_script.sh",
  "lateral_movement_tool.ps1",
  "payroll_database_backup_decrypt.zip",
];

export default function NLPTopicTab() {
  const [username, setUsername] = useState("JDOE");
  const [corpusText, setCorpusText] = useState(DEMO_CORPUS.join("\n"));
  const [targetText, setTargetText] = useState(DEMO_TARGETS_NORMAL.join("\n"));
  const [nTopics, setNTopics] = useState(5);
  const [result, setResult] = useState<TopicResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAnomaly = () => {
    setTargetText(DEMO_TARGETS_ANOMALOUS.join("\n"));
  };

  const run = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const corpus = corpusText.split("\n").map((s) => s.trim()).filter(Boolean);
      const targets = targetText.split("\n").map((s) => s.trim()).filter(Boolean);
      const data = await analyzeTopics({
        username,
        target_documents: targets,
        corpus_documents: corpus,
        n_topics: nTopics,
      });
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const anomalyColor = result?.is_topic_anomaly
    ? "text-red-400"
    : "text-emerald-400";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-violet-400" />
          <h2 className="text-xl font-bold text-white">NLP Topic Anomaly Engine</h2>
          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            LDA • Kim et al. 2019
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          Trains a Latent Dirichlet Allocation model on a user's normal document corpus, then flags documents
          whose semantic topic is outside the established baseline — detecting exfiltration by file-type shift.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Corpus */}
        <div className="glass-panel rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Normal Corpus Documents</span>
            <span className="text-xs text-zinc-500">(one per line)</span>
          </div>
          <textarea
            value={corpusText}
            onChange={(e) => setCorpusText(e.target.value)}
            rows={8}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 font-mono resize-none focus:outline-none focus:border-violet-500/50"
          />
        </div>

        {/* Targets */}
        <div className="glass-panel rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">Target Documents to Score</span>
            </div>
            <button
              onClick={loadAnomaly}
              className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              Load Anomalous Example
            </button>
          </div>
          <textarea
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            rows={8}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 font-mono resize-none focus:outline-none focus:border-violet-500/50"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-2xl p-5 flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <label className="text-xs text-zinc-400 font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 w-36"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-zinc-400 font-medium">LDA Topics (N)</label>
          <input
            type="number"
            min={2}
            max={20}
            value={nTopics}
            onChange={(e) => setNTopics(Number(e.target.value))}
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 w-24"
          />
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="ml-auto px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-violet"
        >
          {loading ? "Analyzing…" : "Run LDA Analysis"}
        </button>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl p-4 border border-red-500/30 bg-red-500/5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Score Summary */}
          <div className={`glass-panel rounded-2xl p-6 border ${result.is_topic_anomaly ? "border-red-500/40 bg-red-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>
            <div className="flex items-center gap-4">
              {result.is_topic_anomaly ? (
                <AlertCircle className="w-8 h-8 text-red-400" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              )}
              <div>
                <div className={`text-2xl font-bold ${anomalyColor}`}>
                  {result.is_topic_anomaly ? "⚠️ Topic Anomaly Detected" : "✅ Behavior Normal"}
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                  Anomaly Score: <span className={`font-bold ${anomalyColor}`}>{(result.anomaly_score * 100).toFixed(1)}%</span> of documents fall outside baseline topics
                  &nbsp;·&nbsp; Corpus: {result.corpus_size} docs &nbsp;·&nbsp; Topics discovered: {result.n_topics}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Flagged Documents */}
            {result.anomalous_documents.length > 0 && (
              <div className="glass-panel rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-white">Flagged Documents</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">{result.anomalous_documents.length} anomalous</span>
                </div>
                <div className="space-y-2">
                  {result.anomalous_documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      <span className="text-xs text-red-200 font-mono">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discovered Topics */}
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Discovered Topic Keywords</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {result.topic_keywords.map((kws, i) => {
                  const isBaseline = result.baseline_topics.includes(i);
                  const isFlagged = result.flagged_topics.includes(i);
                  return (
                    <div key={i} className={`px-3 py-2 rounded-lg border text-xs ${isFlagged ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"}`}>
                      <span className={`font-semibold ${isFlagged ? "text-red-300" : isBaseline ? "text-cyan-300" : "text-zinc-300"}`}>
                        Topic {i} {isFlagged ? "🔴 NEW" : isBaseline ? "🟢 Baseline" : ""}
                      </span>
                      <span className="text-zinc-400 ml-2">{kws.slice(0, 5).join(", ")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Per-doc scores */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <span className="text-sm font-semibold text-white">Document-Level Topic Vectors</span>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Document</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Dominant Topic</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Confidence</th>
                    <th className="text-left py-2 text-zinc-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.document_vectors.map((dv, i) => {
                    const isAnom = result.anomalous_documents.includes(dv.document);
                    return (
                      <tr key={i} className={`border-b border-white/5 ${isAnom ? "bg-red-500/5" : ""}`}>
                        <td className="py-2 pr-4 text-zinc-300 font-mono max-w-xs truncate">{dv.document}</td>
                        <td className="py-2 pr-4 text-cyan-300">Topic {dv.dominant_topic}</td>
                        <td className="py-2 pr-4 text-zinc-300">{(dv.dominant_topic_probability * 100).toFixed(1)}%</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isAnom ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                            {isAnom ? "Anomalous" : "Normal"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
