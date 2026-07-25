"use client";
import { UploadCloud, Terminal } from "lucide-react";

export default function IngestorTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
      {/* Input Panel */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <UploadCloud className="text-violet-500" />
          Ingestion Terminal
        </h3>
        
        <div className="space-y-6 flex-1 flex flex-col">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Load Simulation Template</label>
            <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors">
              <option>Windows: Successful Login (EventID 4624)</option>
              <option>Windows: Failed Login (EventID 4625)</option>
              <option>Linux SSH: Authentication Failure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Telemetry Source Type</label>
            <input 
              type="text" 
              defaultValue="windows"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Raw JSON Payload</label>
            <textarea 
              className="w-full flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-zinc-300 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
              defaultValue={`{\n  "EventID": 4624,\n  "LogonType": 2,\n  "TargetUserName": "admin_user"\n}`}
            ></textarea>
          </div>

          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white px-4 py-4 rounded-xl font-medium transition-all glow-violet flex justify-center items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Transmit Log Batch to Pipeline
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Terminal className="text-fuchsia-500" />
          Pipeline Ingestion Logs
        </h3>
        
        <div className="flex-1 bg-black/80 border border-white/5 rounded-xl p-4 font-mono text-sm overflow-y-auto">
          <div className="text-zinc-500 mb-2">[SYSTEM] Ingestion terminal ready. Select a template and click Transmit.</div>
          <div className="text-violet-400 mb-2">{">"} Waiting for telemetry...</div>
        </div>
      </div>
    </div>
  );
}
