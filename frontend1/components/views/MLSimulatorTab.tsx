"use client";
import { useState } from "react";
import { Cpu, ShieldAlert } from "lucide-react";

export default function MLSimulatorTab() {
  const [anomalyScore, setAnomalyScore] = useState(0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Cpu className="text-violet-500" />
            Behavior Parameter Simulator
          </h3>
          <p className="text-zinc-400 text-sm mt-1">Slide inputs to represent current telemetry. Trigger the Isolation Forest & Autoencoder Models.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Username for Analysis</label>
            <input 
              type="text" 
              defaultValue="admin_user"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          <div className="space-y-5">
            {[
              { label: "Login Hour", min: 0, max: 23, val: "14", step: 1 },
              { label: "Failed Login Ratio (%)", min: 0, max: 100, val: "0", step: 1 },
              { label: "Bytes Transferred (KB)", min: 0, max: 100000, val: "512", step: 500 },
              { label: "Admin Commands Count", min: 0, max: 50, val: "0", step: 1 },
              { label: "Unique Devices Used", min: 1, max: 10, val: "1", step: 1 }
            ].map((slider, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">{slider.label}</span>
                  <span className="font-mono text-violet-400">{slider.val}</span>
                </div>
                <input type="range" min={slider.min} max={slider.max} step={slider.step} defaultValue={slider.val} className="w-full accent-violet-500" />
              </div>
            ))}
          </div>

          <button 
            onClick={() => setAnomalyScore(82)}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white px-4 py-4 rounded-xl font-medium transition-all glow-violet flex justify-center items-center gap-2 mt-4">
            <Cpu className="w-5 h-5" />
            Execute ML Ensemble Evaluation
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
        {anomalyScore > 0 ? (
          <>
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold border ${anomalyScore > 75 ? 'bg-red-500/20 text-red-400 border-red-500/50 glow-red' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>
              {anomalyScore > 75 ? 'ANOMALY DETECTED' : 'NORMAL'}
            </div>
            
            <h3 className="text-xl font-semibold mb-8">Evaluation Diagnostics</h3>
            
            <div className="relative w-48 h-48 rounded-full border-[8px] border-white/5 flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full border-[8px] border-red-500/80 glow-red" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: `rotate(${(anomalyScore / 100) * 360}deg)` }}></div>
              <div className="text-5xl font-bold font-mono text-white">{anomalyScore}%</div>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-zinc-400 text-sm">Isolation Forest Score</span>
                <span className="font-mono text-red-400 font-bold">85%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-zinc-400 text-sm">Autoencoder Loss</span>
                <span className="font-mono text-orange-400 font-bold">78%</span>
              </div>
            </div>
          </>
        ) : (
          <div className="opacity-50 flex flex-col items-center">
            <ShieldAlert className="w-16 h-16 mb-4" />
            <h3 className="text-xl">Awaiting Simulation</h3>
            <p className="text-sm mt-2 max-w-xs">Configure parameters on the left and click execute to trigger real-time AI security grading.</p>
          </div>
        )}
      </div>
    </div>
  );
}
