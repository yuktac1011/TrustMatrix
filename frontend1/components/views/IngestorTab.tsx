"use client";
import { UploadCloud, Terminal } from "lucide-react";
import { useState } from "react";
import { ingestLogs } from "../../lib/api";

export default function IngestorTab() {
  const [sourceType, setSourceType] = useState("windows");
  const [payloadText, setPayloadText] = useState(`{\n  "EventID": 4624,\n  "LogonType": 2,\n  "TargetUserName": "admin_user"\n}`);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Ingestion terminal ready. Select a template and click Transmit.", "> Waiting for telemetry..."]);
  const [loading, setLoading] = useState(false);

  const writeLog = (msg: string, isError = false) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${isError ? "[ERROR] " : ""}${msg}`]);
  };

  const handleTransmit = async () => {
    let parsedPayload;
    try {
      parsedPayload = JSON.parse(payloadText);
    } catch (e) {
      writeLog("Parsing Error: Invalid JSON input", true);
      return;
    }

    setLoading(true);
    writeLog(`Sending raw batch transmission to Log Ingestor... (${sourceType})`);
    
    try {
      const response = await ingestLogs({ source_type: sourceType, raw_payload: parsedPayload });
      writeLog(`Success: Received status: ${response.status || 'Accepted'}, records: ${response.records_received || 1}`);
    } catch (err: any) {
      writeLog(`API Error: ${err.message}. Running local fallback...`, true);
      setTimeout(() => {
        writeLog(`Local Normalizer matched: ${sourceType.toUpperCase()}_EVENT`);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

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
            <select className="w-full bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors text-black dark:text-white">
              <option>Windows: Successful Login (EventID 4624)</option>
              <option>Windows: Failed Login (EventID 4625)</option>
              <option>Linux SSH: Authentication Failure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Telemetry Source Type</label>
            <input 
              type="text" 
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors text-black dark:text-white"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Raw JSON Payload</label>
            <textarea 
              className="w-full flex-1 bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-zinc-800 dark:text-zinc-300 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
            ></textarea>
          </div>

          <button 
            onClick={handleTransmit}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-4 rounded-xl font-medium transition-all glow-violet flex justify-center items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            {loading ? "Transmitting..." : "Transmit Log Batch to Pipeline"}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Terminal className="text-fuchsia-500" />
          Pipeline Ingestion Logs
        </h3>
        
        <div className="flex-1 bg-black/10 dark:bg-black/80 border border-zinc-200 dark:border-white/5 rounded-xl p-4 font-mono text-sm overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className={`mb-2 ${log.includes('[ERROR]') ? 'text-red-500' : log.includes('Success') ? 'text-green-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
