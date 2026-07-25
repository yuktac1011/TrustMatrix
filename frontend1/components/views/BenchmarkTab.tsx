"use client";
import { useState } from "react";
import { BarChart3, PlayCircle, TrendingUp, Users, ShieldCheck, AlertTriangle } from "lucide-react";
import { runDemoBenchmark } from "../../lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface TDRPoint {
  threshold_percent: number;
  true_positives: number;
  total_malicious: number;
  true_detection_rate: number;
}

interface ModelResult {
  model_name: string;
  tdr_curve: TDRPoint[];
  auc_approximation: number;
}

interface ScoredRecord {
  user: string;
  date: string;
  role: string;
  is_malicious: boolean;
  isolation_forest_score: number;
  autoencoder_score: number;
  ensemble_score: number;
}

interface BenchmarkReport {
  total_records: number;
  total_malicious: number;
  malicious_rate_percent: number;
  isolation_forest: ModelResult;
  autoencoder_proxy: ModelResult;
  ensemble: ModelResult;
  best_model: string;
  best_auc: number;
  summary: string;
  scored_records: ScoredRecord[];
}

// ── Color helpers ─────────────────────────────────────────────────────────────
const MODEL_COLORS: Record<string, string> = {
  "Isolation Forest": "text-[#38bdf8]",
  "PCA Autoencoder": "text-[#a78bfa]",
  "Ensemble (IF + AE)": "text-[#86efac]",
};

function TDRBar({ rate, threshold }: { rate: number; threshold: number }) {
  const pct = Math.round(rate * 100);
  const color = pct >= 80 ? "bg-[#86efac]" : pct >= 50 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-400 w-8 text-right shrink-0">Top {threshold}%</span>
      <div className="flex-1 bg-[#111827] rounded-full h-3 overflow-hidden border border-[#172554]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-white w-10 text-right shrink-0">{pct}%</span>
    </div>
  );
}

export default function BenchmarkTab() {
  const [report, setReport] = useState<BenchmarkReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAllRecords, setShowAllRecords] = useState(false);

  const run = async () => {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const data = await runDemoBenchmark();
      setReport(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Benchmark failed");
    } finally {
      setLoading(false);
    }
  };

  const displayedRecords = report
    ? showAllRecords
      ? report.scored_records
      : report.scored_records.slice(0, 10)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 bg-[#01021a] border-[#172554]">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-[#86efac]" />
          <h2 className="text-xl font-bold text-white">CERT R6.2 Benchmark Evaluator</h2>
          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/30 font-semibold">
            Kim et al. 2019
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          Evaluates TrustMatrix anomaly detection models on a 200-record synthetic dataset mirroring CERT R6.2
          (195 normal + 5 labeled malicious insiders). Reports True Detection Rate (TDR) at top-1% to top-30%
          thresholds — the gold standard evaluation from academic insider threat research.
        </p>
        <button
          onClick={run}
          disabled={loading}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#86efac] hover:bg-[#86efac]/90 text-[#111827] font-bold text-sm transition-all disabled:opacity-50 glow-primary"
        >
          <PlayCircle className="w-4 h-4" />
          {loading ? "Running Benchmark…" : "Run Demo Benchmark"}
        </button>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl p-4 border border-red-500/30 bg-red-500/5 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Records", value: report.total_records, icon: Users, color: "text-[#38bdf8]" },
              { label: "Malicious Insiders", value: report.total_malicious, icon: AlertTriangle, color: "text-red-400" },
              { label: "Best AUC", value: `${(report.best_auc * 100).toFixed(1)}%`, icon: TrendingUp, color: "text-[#86efac]" },
              { label: "Best Model", value: report.best_model.split(" ")[0], icon: ShieldCheck, color: "text-[#a78bfa]" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-panel rounded-2xl p-4 bg-[#01021a] border-[#172554]">
                <div className={`flex items-center gap-2 mb-1 ${color}`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium text-zinc-400">{label}</span>
                </div>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
              </div>
            ))}
          </div>

          {/* AI Summary */}
          <div className="glass-panel rounded-2xl p-5 border border-[#86efac]/20 bg-[#86efac]/5">
            <p className="text-sm text-[#86efac] leading-relaxed font-medium">{report.summary}</p>
          </div>

          {/* TDR Curves */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[report.isolation_forest, report.autoencoder_proxy, report.ensemble].map((model) => (
              <div key={model.model_name} className="glass-panel rounded-2xl p-5 space-y-4 bg-[#01021a] border-[#172554]">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${MODEL_COLORS[model.model_name] || "text-white"}`}>
                    {model.model_name}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#111827] text-[#86efac] border border-[#172554] font-medium">
                    AUC: {(model.auc_approximation * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-2.5">
                  {model.tdr_curve.map((pt) => (
                    <TDRBar
                      key={pt.threshold_percent}
                      rate={pt.true_detection_rate}
                      threshold={pt.threshold_percent}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Scored Records Table */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 bg-[#01021a] border-[#172554]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Scored Records
                <span className="ml-2 text-xs text-zinc-400">(sorted by ensemble risk score)</span>
              </span>
              <button
                onClick={() => setShowAllRecords((p) => !p)}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#172554] text-[#86efac] border border-[#172554] transition-colors font-medium"
              >
                {showAllRecords ? "Show Top 10" : `Show All ${report.scored_records.length}`}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#172554]">
                    {["User", "Date", "Role", "IF Score", "AE Score", "Ensemble", "Label"].map((h) => (
                      <th key={h} className="text-left py-2 pr-4 text-zinc-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedRecords.map((r, i) => (
                    <tr
                      key={i}
                      className={`border-b border-[#172554]/50 ${r.is_malicious ? "bg-red-500/5" : ""}`}
                    >
                      <td className="py-2 pr-4 text-zinc-200 font-mono">{r.user}</td>
                      <td className="py-2 pr-4 text-zinc-400">{r.date}</td>
                      <td className="py-2 pr-4 text-zinc-400">{r.role}</td>
                      <td className="py-2 pr-4 text-[#38bdf8]">{(r.isolation_forest_score * 100).toFixed(0)}%</td>
                      <td className="py-2 pr-4 text-[#a78bfa]">{(r.autoencoder_score * 100).toFixed(0)}%</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#111827] border border-[#172554] rounded-full h-2">
                            <div
                              className={`h-full rounded-full ${r.ensemble_score > 0.7 ? "bg-red-500" : r.ensemble_score > 0.4 ? "bg-amber-400" : "bg-[#86efac]"}`}
                              style={{ width: `${r.ensemble_score * 100}%` }}
                            />
                          </div>
                          <span className="text-[#86efac] font-bold">{(r.ensemble_score * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${r.is_malicious ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-[#111827] text-zinc-400 border border-[#172554]"}`}>
                          {r.is_malicious ? "🔴 Malicious" : "Normal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

