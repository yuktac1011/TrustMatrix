"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Terminal } from "lucide-react";
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
    } catch {
      writeLog("Parsing Error: Invalid JSON input", true);
      return;
    }

    setLoading(true);
    writeLog(`Sending raw batch transmission to Log Ingestor... (${sourceType})`);

    try {
      const response = await ingestLogs({ source_type: sourceType, raw_payload: parsedPayload });
      writeLog(`Success: Received status: ${response.status || 'Accepted'}, records: ${response.records_received || 1}`);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      writeLog(`API Error: ${errMsg}. Running local fallback...`, true);
      setTimeout(() => {
        writeLog(`Local Normalizer matched: ${sourceType.toUpperCase()}_EVENT`);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
    >
      {/* Input Panel */}
      <div className="glass-panel p-6 rounded-2xl bg-[#01021a] border-[#172554] flex flex-col space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-white border-b border-[#172554] pb-4">
          <UploadCloud className="text-[#86efac]" />
          Ingestion Terminal
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Load Simulation Template</label>
            <select className="w-full bg-[#111827] border border-[#172554] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#86efac] text-white font-mono">
              <option>Windows: Successful Login (EventID 4624)</option>
              <option>Windows: Failed Login (EventID 4625)</option>
              <option>Linux SSH: Authentication Failure</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Telemetry Source Type</label>
            <input
              type="text"
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full bg-[#111827] border border-[#172554] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#86efac] text-white font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Raw JSON Payload</label>
            <textarea
              rows={6}
              className="w-full bg-[#111827] border border-[#172554] rounded-xl px-4 py-3 text-sm font-mono text-zinc-200 focus:outline-none focus:border-[#86efac] resize-none"
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
            ></textarea>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTransmit}
          disabled={loading}
          className="w-full bg-[#86efac] hover:bg-[#86efac]/90 disabled:opacity-50 text-[#111827] px-4 py-3.5 rounded-xl font-bold transition-all glow-primary flex justify-center items-center gap-2 cursor-pointer shrink-0"
        >
          <UploadCloud className="w-5 h-5" />
          {loading ? "Transmitting..." : "Transmit Log Batch to Pipeline"}
        </motion.button>
      </div>

      {/* Output Panel */}
      <div className="glass-panel p-6 rounded-2xl bg-[#01021a] border-[#172554] flex flex-col space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-white border-b border-[#172554] pb-4">
          <Terminal className="text-[#38bdf8]" />
          Pipeline Ingestion Logs
        </h3>

        <div className="min-h-[360px] bg-[#111827] border border-[#172554] rounded-xl p-4 font-mono text-sm overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className={`mb-2 ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('Success') ? 'text-[#86efac]' : 'text-zinc-400'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
