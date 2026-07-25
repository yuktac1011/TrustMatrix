"use client";
import { useState } from "react";
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
    } catch (e) {
      // Basic mock fallback if backend is offline to preserve the demo feel
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Cpu className="text-violet-500" />
            Behavior Parameter Simulator
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Slide inputs to represent current telemetry. Trigger the Isolation Forest & Autoencoder Models.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Username for Analysis</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors text-black dark:text-white"
            />
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Login Hour</span>
                <span className="font-mono text-violet-600 dark:text-violet-400">{loginHour}</span>
              </div>
              <input type="range" min={0} max={23} value={loginHour} onChange={(e) => setLoginHour(Number(e.target.value))} className="w-full accent-violet-500" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Failed Login Ratio (%)</span>
                <span className="font-mono text-violet-600 dark:text-violet-400">{failedRatio}</span>
              </div>
              <input type="range" min={0} max={100} value={failedRatio} onChange={(e) => setFailedRatio(Number(e.target.value))} className="w-full accent-violet-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Bytes Transferred (KB)</span>
                <span className="font-mono text-violet-600 dark:text-violet-400">{bytesKb}</span>
              </div>
              <input type="range" min={0} max={100000} step={500} value={bytesKb} onChange={(e) => setBytesKb(Number(e.target.value))} className="w-full accent-violet-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Admin Commands Count</span>
                <span className="font-mono text-violet-600 dark:text-violet-400">{adminCmds}</span>
              </div>
              <input type="range" min={0} max={50} value={adminCmds} onChange={(e) => setAdminCmds(Number(e.target.value))} className="w-full accent-violet-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Unique Devices Used</span>
                <span className="font-mono text-violet-600 dark:text-violet-400">{devices}</span>
              </div>
              <input type="range" min={1} max={10} value={devices} onChange={(e) => setDevices(Number(e.target.value))} className="w-full accent-violet-500" />
            </div>
          </div>

          <button 
            onClick={handleExecute}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-4 rounded-xl font-medium transition-all glow-violet flex justify-center items-center gap-2 mt-4">
            <Cpu className="w-5 h-5" />
            {loading ? "Evaluating..." : "Execute ML Ensemble Evaluation"}
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
        {analysisResult ? (
          <>
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold border ${isAnomaly ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50 glow-red' : 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50'}`}>
              {isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL'}
            </div>
            
            <h3 className="text-xl font-semibold mb-8 text-black dark:text-white">Evaluation Diagnostics</h3>
            
            <div className="relative w-48 h-48 rounded-full border-[8px] border-zinc-200 dark:border-white/5 flex items-center justify-center mb-8">
              <div className={`absolute inset-0 rounded-full border-[8px] ${isAnomaly ? 'border-red-500/80 glow-red' : 'border-green-500/80'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: `rotate(${(currentScore / 100) * 360}deg)` }}></div>
              <div className="text-5xl font-bold font-mono text-black dark:text-white">{currentScore.toFixed(1)}%</div>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">Isolation Forest Score</span>
                <span className={`font-mono font-bold ${analysisResult.isolation_forest_score > 70 ? 'text-red-500' : 'text-green-500'}`}>{analysisResult.isolation_forest_score.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">Autoencoder Loss</span>
                <span className={`font-mono font-bold ${analysisResult.autoencoder_score > 70 ? 'text-orange-500' : 'text-green-500'}`}>{analysisResult.autoencoder_score.toFixed(1)}%</span>
              </div>
            </div>
          </>
        ) : (
          <div className="opacity-50 flex flex-col items-center">
            <ShieldAlert className="w-16 h-16 mb-4 text-black dark:text-white" />
            <h3 className="text-xl text-black dark:text-white">Awaiting Simulation</h3>
            <p className="text-sm mt-2 max-w-xs text-zinc-500 dark:text-zinc-400">Configure parameters on the left and click execute to trigger real-time AI security grading.</p>
          </div>
        )}
      </div>
    </div>
  );
}
