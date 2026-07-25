"use client";
import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { explainThreat } from "../../lib/api";

export default function CopilotTab() {
  const [username, setUsername] = useState("admin_user");
  const [score, setScore] = useState(84);
  const [reasons, setReasons] = useState("Late hour activity, Massive data transfer");
  const [mitre, setMitre] = useState("T1078, T1048.002");
  const [logs, setLogs] = useState("User admin_user logged in at 3:00 AM from country 'Russia' (historical standard: 'US') using laptop LAPTOP-99121.\\nExecuted PowerShell script with administrative privilege level.\\nDownloaded 450MB of proprietary research data via VPN endpoint.");

  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleAskCopilot = async () => {
    setLoading(true);
    setAnalyzed(true);
    setReport(null);

    const payload = {
      username,
      anomaly_score: score,
      mitre_techniques: mitre.split(',').map(s => s.trim()),
      flagged_reasons: reasons.split(',').map(s => s.trim()),
      raw_events_summary: logs
    };

    try {
      const data = await explainThreat(payload);
      setReport(data);
    } catch {
      // Mock fallback
      setTimeout(() => {
        setReport({
          summary: `The user '${username}' showed significant security deviations. Multi-point baseline drift indicates a high risk profile. Trigger features include: ${reasons}. Action threshold was crossed with risk value: ${score}%.`,
          suspected_tactics: payload.mitre_techniques,
          confidence_score: score > 75 ? "High" : "Medium",
          remediation_steps: [
            "Immediate Account Lockout: Disable in Active Directory to prevent further unauthorized access.",
            "VPN Session Termination: Terminate any active sessions originating from anomalous IPs.",
            "Audit Logs Review: Check the exact contents of scripts executed to identify potential backdoors."
          ]
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* Context Setup */}
      <div className="glass-panel p-6 rounded-2xl bg-[#01021a] border-[#172554] xl:col-span-4 flex flex-col h-full overflow-y-auto">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          <Bot className="text-[#86efac]" />
          Investigation Context
        </h3>
        
        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Target Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#111827] border border-[#172554] rounded-xl px-4 py-2 text-sm focus:border-[#86efac] text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Risk Score (0-100)</label>
            <input type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full bg-[#111827] border border-[#172554] rounded-xl px-4 py-2 text-sm focus:border-[#86efac] text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Flagged Indicators</label>
            <input type="text" value={reasons} onChange={(e) => setReasons(e.target.value)} className="w-full bg-[#111827] border border-[#172554] rounded-xl px-4 py-2 text-sm focus:border-[#86efac] text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">MITRE Techniques</label>
            <input type="text" value={mitre} onChange={(e) => setMitre(e.target.value)} className="w-full bg-[#111827] border border-[#172554] rounded-xl px-4 py-2 text-sm focus:border-[#86efac] text-white" />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Raw Activity Trace Summary</label>
            <textarea 
              className="w-full flex-1 bg-[#111827] border border-[#172554] rounded-xl px-4 py-2 text-sm font-mono text-zinc-200 resize-none focus:border-[#86efac]"
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button 
          onClick={handleAskCopilot}
          disabled={loading}
          className="w-full bg-[#86efac] hover:bg-[#86efac]/90 disabled:opacity-50 text-[#111827] px-4 py-4 rounded-xl font-bold transition-all glow-primary flex justify-center items-center gap-2 mt-6">
          <Sparkles className="w-5 h-5" />
          {loading ? "Analyzing..." : "Ask AI SOC Copilot to Explain"}
        </button>
      </div>

      {/* Output Panel */}
      <div className="glass-panel p-8 rounded-2xl bg-[#01021a] border-[#172554] xl:col-span-8 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#172554] pb-6 mb-6">
          <h3 className="text-2xl font-semibold flex items-center gap-3 text-white">
            Threat Analysis Report
          </h3>
          {report && (
            <span className="bg-[#86efac]/20 text-[#86efac] px-3 py-1 rounded-full text-sm border border-[#86efac]/30 glow-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Confidence: {report.confidence_score}
            </span>
          )}
        </div>

        {analyzed ? (
          loading ? (
             <div className="flex justify-center items-center h-64 text-[#86efac] animate-pulse font-medium">
               AI Analyst is reasoning threat vector maps...
             </div>
          ) : report && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#86efac]"></span>
                  Executive Summary
                </h4>
                <p className="text-zinc-300 leading-relaxed">
                  {report.summary}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#86efac]"></span>
                  Suspected Tactics Map
                </h4>
                <div className="flex flex-wrap gap-3">
                  {report.suspected_tactics?.map((t: string, i: number) => (
                    <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium">{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#86efac]"></span>
                  Actionable Incident Response Playbook
                </h4>
                <ul className="space-y-3">
                  {report.remediation_steps?.map((step: string, i: number) => (
                    <li key={i} className="flex gap-3 text-zinc-300 bg-[#111827] p-3.5 rounded-xl border border-[#172554]">
                      <div className="w-6 h-6 rounded-full bg-[#86efac]/20 text-[#86efac] flex items-center justify-center text-xs border border-[#86efac]/30 shrink-0 font-bold">{i+1}</div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-500 opacity-50">
            <Bot className="w-20 h-20 mb-4 opacity-50 text-[#86efac]" />
            <p className="text-zinc-400">Submit context logs on the left to invoke the AI SOC Copilot Engine.</p>
          </div>
        )}
      </div>
    </div>
  );
}

