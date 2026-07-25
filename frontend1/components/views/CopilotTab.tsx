"use client";
import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";

export default function CopilotTab() {
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* Context Setup */}
      <div className="glass-panel p-6 rounded-2xl xl:col-span-4 flex flex-col h-full overflow-y-auto">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Bot className="text-fuchsia-500" />
          Investigation Context
        </h3>
        
        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Target Username</label>
            <input type="text" defaultValue="admin_user" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-fuchsia-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Risk Score (0-100)</label>
            <input type="number" defaultValue="84" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-fuchsia-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Flagged Indicators</label>
            <input type="text" defaultValue="Late hour activity, Massive data transfer" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-fuchsia-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">MITRE Techniques</label>
            <input type="text" defaultValue="T1078, T1048.002" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-fuchsia-500/50" />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Raw Activity Trace Summary</label>
            <textarea 
              className="w-full flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm font-mono text-zinc-300 resize-none focus:border-fuchsia-500/50"
              defaultValue="User admin_user logged in at 3:00 AM from country 'Russia' (historical standard: 'US') using laptop LAPTOP-99121.\nExecuted PowerShell script with administrative privilege level.\nDownloaded 450MB of proprietary research data via VPN endpoint."
            ></textarea>
          </div>
        </div>

        <button 
          onClick={() => setAnalyzed(true)}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-4 rounded-xl font-medium transition-all glow-fuchsia flex justify-center items-center gap-2 mt-6">
          <Sparkles className="w-5 h-5" />
          Ask AI SOC Copilot to Explain
        </button>
      </div>

      {/* Output Panel */}
      <div className="glass-panel p-8 rounded-2xl xl:col-span-8 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-6">
          <h3 className="text-2xl font-semibold flex items-center gap-3">
            Threat Analysis Report
          </h3>
          {analyzed && (
            <span className="bg-fuchsia-500/20 text-fuchsia-400 px-3 py-1 rounded-full text-sm border border-fuchsia-500/30 glow-fuchsia flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Confidence: High
            </span>
          )}
        </div>

        {analyzed ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                Executive Summary
              </h4>
              <p className="text-zinc-300 leading-relaxed">
                The user account <strong>admin_user</strong> has exhibited a highly anomalous behavioral sequence indicative of credential compromise followed by data exfiltration. The activity deviates significantly from the user's established baseline, specifically in geolocation (Russia vs. US), access time (3:00 AM), and volume of data transferred (450MB).
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                Suspected Tactics Map
              </h4>
              <div className="flex gap-3">
                <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm">T1078 - Valid Accounts</span>
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 px-4 py-2 rounded-lg text-sm">T1048.002 - Exfiltration Over Asymmetric Protocol</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                Actionable Incident Response Playbook
              </h4>
              <ul className="space-y-3">
                <li className="flex gap-3 text-zinc-300 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs border border-violet-500/30 shrink-0">1</div>
                  <span><strong>Immediate Account Lockout:</strong> Disable admin_user in Active Directory to prevent further unauthorized access.</span>
                </li>
                <li className="flex gap-3 text-zinc-300 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs border border-violet-500/30 shrink-0">2</div>
                  <span><strong>VPN Session Termination:</strong> Terminate any active sessions originating from the anomalous Russian IP address.</span>
                </li>
                <li className="flex gap-3 text-zinc-300 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs border border-violet-500/30 shrink-0">3</div>
                  <span><strong>Audit Logs Review:</strong> Check the exact contents of the PowerShell script executed to identify potential backdoors.</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-500 opacity-50">
            <Bot className="w-20 h-20 mb-4 opacity-50" />
            <p>Submit context logs on the left to invoke the AI SOC Copilot Engine.</p>
          </div>
        )}
      </div>
    </div>
  );
}
