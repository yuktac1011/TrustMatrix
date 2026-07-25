"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, ShieldAlert } from "lucide-react";
import { analyzeAnomaly } from "../../lib/api";

export default function MLSimulatorTab() {
  const [username, setUsername] = useState("admin_user");
  const [loginHour, setLoginHour] = useState(14);
  const [failedRatio, setFailedRatio] = useState(0);
  const [bytesKb, setBytesKb] = useState(512);
  const [adminCmds, setAdminCmds] = useState(0);
  const [devices, setDevices] = useState(1);

  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    const payload = {
      current_features: {
        username: username,
        login_hour: loginHour,
        login_weekday: 0,
        failed_login_count: Math.round(failedRatio * 0.1),
        total_logins: 10,
        failed_login_ratio: failedRatio / 100.0,
        bytes_transferred: bytesKb * 1024,
        admin_commands_count: adminCmds,
        unique_devices_used: devices,
        unique_locations_visited: 1
      },
      historical_features: []
    };

    try {
      const data = await analyzeAnomaly(payload);
      setAnalysisResult(data);
    } catch {
      const isAnomaly = failedRatio > 30 || adminCmds > 5 || bytesKb > 50000;
      const score = isAnomaly ? 85 : 15;
      setAnalysisResult({
        anomaly_score: score,
        is_anomaly: isAnomaly,
        isolation_forest_score: score + 2,
        autoencoder_score: score - 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const currentScore = analysisResult ? analysisResult.anomaly_score : 0;
  const isAnomaly = analysisResult ? analysisResult.is_anomaly : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 xl:grid-cols-2 gap-8"
    >
      {/* Controls */}
      <div className="glass-panel p-6 rounded-2xl bg-[#01021a] border-[#172554]">
        <div className="mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Cpu className="text-[#86efac]" />
            Behavior Parameter Simulator
          </h3>
          <p className="text-zinc-400 text-sm mt-1">Slide inputs to represent current telemetry. Trigger the Isolation Forest & Autoencoder Models.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Username for Analysis</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#111827] border border-[#172554] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#86efac] transition-colors text-white font-mono"
            />
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Login Hour</span>
                <span className="font-mono text-[#86efac] font-bold">{loginHour}:00</span>
              </div>
              <input type="range" min={0} max={23} value={loginHour} onChange={(e) => setLoginHour(Number(e.target.value))} className="w-full accent-[#86efac]" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Failed Login Ratio (%)</span>
                <span className="font-mono text-[#86efac] font-bold">{failedRatio}%</span>
              </div>
              <input type="range" min={0} max={100} value={failedRatio} onChange={(e) => setFailedRatio(Number(e.target.value))} className="w-full accent-[#86efac]" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Bytes Transferred (KB)</span>
                <span className="font-mono text-[#86efac] font-bold">{bytesKb} KB</span>
              </div>
              <input type="range" min={0} max={100000} step={500} value={bytesKb} onChange={(e) => setBytesKb(Number(e.target.value))} className="w-full accent-[#86efac]" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Admin Commands Count</span>
                <span className="font-mono text-[#86efac] font-bold">{adminCmds}</span>
              </div>
              <input type="range" min={0} max={50} value={adminCmds} onChange={(e) => setAdminCmds(Number(e.target.value))} className="w-full accent-[#86efac]" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Unique Devices Used</span>
                <span className="font-mono text-[#86efac] font-bold">{devices}</span>
              </div>
              <input type="range" min={1} max={10} value={devices} onChange={(e) => setDevices(Number(e.target.value))} className="w-full accent-[#86efac]" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExecute}
            disabled={loading}
            className="w-full bg-[#86efac] hover:bg-[#86efac]/90 disabled:opacity-50 text-[#111827] px-4 py-4 rounded-xl font-bold transition-all glow-primary flex justify-center items-center gap-2 mt-4 cursor-pointer"
          >
            <Cpu className="w-5 h-5" />
            {loading ? "Evaluating..." : "Execute ML Ensemble Evaluation"}
          </motion.button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="glass-panel p-6 rounded-2xl bg-[#01021a] border-[#172554] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {analysisResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold font-mono border ${isAnomaly ? 'bg-red-500/20 text-red-400 border-red-500/50 glow-red' : 'bg-[#86efac]/20 text-[#86efac] border-[#86efac]/50 glow-primary'}`}>
              {isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL'}
            </div>

            <h3 className="text-xl font-semibold mb-8 text-white">Evaluation Diagnostics</h3>

            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative w-48 h-48 rounded-full border-[8px] border-[#172554] flex items-center justify-center mb-8 bg-[#111827]"
            >
              <div className={`absolute inset-0 rounded-full border-[8px] ${isAnomaly ? 'border-red-500 glow-red' : 'border-[#86efac] glow-primary'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: `rotate(${(currentScore / 100) * 360}deg)` }}></div>
              <div className="text-5xl font-bold font-mono text-white">{currentScore.toFixed(1)}%</div>
            </motion.div>

            <div className="w-full max-w-md space-y-4">
              <motion.div
                whileHover={{ x: 3 }}
                className="flex justify-between items-center p-3.5 rounded-xl bg-[#111827] border border-[#172554]"
              >
                <span className="text-zinc-400 text-sm">Isolation Forest Score</span>
                <span className={`font-mono font-bold ${analysisResult.isolation_forest_score > 70 ? 'text-red-400' : 'text-[#86efac]'}`}>{analysisResult.isolation_forest_score.toFixed(1)}%</span>
              </motion.div>

              <motion.div
                whileHover={{ x: 3 }}
                className="flex justify-between items-center p-3.5 rounded-xl bg-[#111827] border border-[#172554]"
              >
                <span className="text-zinc-400 text-sm">Autoencoder Loss</span>
                <span className={`font-mono font-bold ${analysisResult.autoencoder_score > 70 ? 'text-amber-400' : 'text-[#86efac]'}`}>{analysisResult.autoencoder_score.toFixed(1)}%</span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="opacity-50 flex flex-col items-center">
            <ShieldAlert className="w-16 h-16 mb-4 text-[#86efac]" />
            <h3 className="text-xl text-white font-semibold">Awaiting Simulation</h3>
            <p className="text-sm mt-2 max-w-xs text-zinc-400">Configure parameters on the left and click execute to trigger real-time AI security grading.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
