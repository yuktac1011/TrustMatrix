"use client";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Gauge, Users, AlertTriangle, Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

export default function OverviewTab() {
  const lineData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    datasets: [
      {
        label: "Threat Index",
        data: [12, 19, 15, 25, 22, 42, 38],
        borderColor: "#86efac",
        backgroundColor: "rgba(134, 239, 172, 0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: "rgba(23, 37, 84, 0.6)" }, ticks: { color: "#cbd5e1" } },
      x: { grid: { color: "rgba(23, 37, 84, 0.6)" }, ticks: { color: "#cbd5e1" } },
    },
  };

  const doughnutData = {
    labels: ["Insider Data Exfiltration", "Privilege Escalation", "Lateral Movement", "Anomalous Login"],
    datasets: [
      {
        data: [40, 20, 15, 25],
        backgroundColor: ["#86efac", "#38bdf8", "#a78bfa", "#f43f5e"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" as const, labels: { color: "#cbd5e1" } },
    },
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-[#86efac] bg-[#01021a] border-[#172554]">
          <div className="flex justify-between items-start">
            <span className="text-[#b5bbd5] font-medium text-sm">Aggregated Risk Index</span>
            <Gauge className="text-[#86efac] w-5 h-5" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">42.8%</span>
            <span className="text-xs text-[#86efac] bg-[#86efac]/10 px-2 py-1 rounded-full border border-[#86efac]/30">+4.2%</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-[#38bdf8] bg-[#01021a] border-[#172554]">
          <div className="flex justify-between items-start">
            <span className="text-[#b5bbd5] font-medium text-sm">Active Baselines</span>
            <Users className="text-[#38bdf8] w-5 h-5" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">128</span>
            <span className="text-xs text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-1 rounded-full border border-[#38bdf8]/30">Learning</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-red-500 bg-[#01021a] border-[#172554] relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
          <div className="relative flex justify-between items-start">
            <span className="text-[#b5bbd5] font-medium text-sm">Critical Anomalies</span>
            <AlertTriangle className="text-red-500 w-5 h-5" />
          </div>
          <div className="relative mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-400">3</span>
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/30">Action Req</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-[#a78bfa] bg-[#01021a] border-[#172554]">
          <div className="flex justify-between items-start">
            <span className="text-[#b5bbd5] font-medium text-sm">Ingestion Telemetry</span>
            <Activity className="text-[#a78bfa] w-5 h-5" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">1,482</span>
            <span className="text-sm text-zinc-400">EPS</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl bg-[#01021a] border-[#172554]">
          <h3 className="text-lg font-semibold text-white mb-6">Threat Index Progression (24h)</h3>
          <div className="h-64">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl bg-[#01021a] border-[#172554]">
          <h3 className="text-lg font-semibold text-white mb-6">Anomaly Classifications by Vector</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Alert Stream */}
      <div className="glass-panel rounded-2xl bg-[#01021a] border-[#172554] overflow-hidden">
        <div className="p-6 border-b border-[#172554] flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">High-Risk Behavioral Anomalies Stream</h3>
          <button className="text-xs bg-[#111827] hover:bg-[#172554] text-[#86efac] px-3 py-1.5 rounded-full border border-[#172554] transition-colors font-medium">
            Clear Stream
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111827] text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Identity</th>
                <th className="px-6 py-4 font-medium">Mitre Tactics</th>
                <th className="px-6 py-4 font-medium">Risk Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172554]">
              <tr className="hover:bg-[#172554]/30 transition-colors">
                <td className="px-6 py-4 text-zinc-400">2 mins ago</td>
                <td className="px-6 py-4 font-mono text-[#86efac]">admin_user</td>
                <td className="px-6 py-4"><span className="bg-[#111827] text-zinc-300 border border-[#172554] px-2 py-1 rounded text-xs">T1078</span></td>
                <td className="px-6 py-4"><span className="text-red-400 font-bold">84%</span></td>
                <td className="px-6 py-4"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs border border-red-500/30">Investigating</span></td>
              </tr>
              <tr className="hover:bg-[#172554]/30 transition-colors">
                <td className="px-6 py-4 text-zinc-400">15 mins ago</td>
                <td className="px-6 py-4 font-mono text-[#38bdf8]">svc_backup</td>
                <td className="px-6 py-4"><span className="bg-[#111827] text-zinc-300 border border-[#172554] px-2 py-1 rounded text-xs">T1048</span></td>
                <td className="px-6 py-4"><span className="text-amber-400 font-bold">72%</span></td>
                <td className="px-6 py-4"><span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs border border-amber-500/30">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

