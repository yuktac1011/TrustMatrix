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
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
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
      y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#9ca3af" } },
      x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#9ca3af" } },
    },
  };

  const doughnutData = {
    labels: ["Insider Data Exfiltration", "Privilege Escalation", "Lateral Movement", "Anomalous Login"],
    datasets: [
      {
        data: [40, 20, 15, 25],
        backgroundColor: ["#8b5cf6", "#d946ef", "#06b6d4", "#f43f5e"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" as const, labels: { color: "#9ca3af" } },
    },
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-violet-500">
          <div className="flex justify-between items-start">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Aggregated Risk Index</span>
            <Gauge className="text-violet-500 w-5 h-5" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">42.8%</span>
            <span className="text-xs text-violet-400 bg-violet-500/10 px-2 py-1 rounded-full">+4.2%</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-fuchsia-500">
          <div className="flex justify-between items-start">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Active Baselines</span>
            <Users className="text-fuchsia-500 w-5 h-5" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">128</span>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Learning</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-red-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
          <div className="relative flex justify-between items-start">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Critical Anomalies</span>
            <AlertTriangle className="text-red-500 w-5 h-5" />
          </div>
          <div className="relative mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-400">3</span>
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">Action Req</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-cyan-500">
          <div className="flex justify-between items-start">
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Ingestion Telemetry</span>
            <Activity className="text-cyan-500 w-5 h-5" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">1,482</span>
            <span className="text-sm text-zinc-500">EPS</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Threat Index Progression (24h)</h3>
          <div className="h-64">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Anomaly Classifications by Vector</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Alert Stream */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-semibold">High-Risk Behavioral Anomalies Stream</h3>
          <button className="text-xs bg-black/5 dark:bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full transition-colors">
            Clear Stream
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Identity</th>
                <th className="px-6 py-4 font-medium">Mitre Tactics</th>
                <th className="px-6 py-4 font-medium">Risk Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              <tr className="hover:bg-black/5 dark:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">2 mins ago</td>
                <td className="px-6 py-4 font-mono text-fuchsia-400">admin_user</td>
                <td className="px-6 py-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">T1078</span></td>
                <td className="px-6 py-4"><span className="text-red-400 font-bold">84%</span></td>
                <td className="px-6 py-4"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs border border-red-500/30">Investigating</span></td>
              </tr>
              <tr className="hover:bg-black/5 dark:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">15 mins ago</td>
                <td className="px-6 py-4 font-mono text-cyan-400">svc_backup</td>
                <td className="px-6 py-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">T1048</span></td>
                <td className="px-6 py-4"><span className="text-orange-400 font-bold">72%</span></td>
                <td className="px-6 py-4"><span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs border border-orange-500/30">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
