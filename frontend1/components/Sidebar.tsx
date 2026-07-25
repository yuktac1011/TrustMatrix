import { ShieldHalf, Activity, Server, Users, Cpu, Bot } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "ingestor", label: "Log Ingestor", icon: Server },
    { id: "baselines", label: "User Baselines", icon: Users },
    { id: "simulator", label: "ML Simulator", icon: Cpu },
    { id: "copilot", label: "AI SOC Copilot", icon: Bot },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col h-full bg-black/40">
      <div className="p-6 flex items-center gap-3">
        <ShieldHalf className="w-8 h-8 text-violet-500" />
        <span className="font-bold text-xl tracking-wider">
          TRUST<span className="text-violet-500">MATRIX</span>
        </span>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-zinc-400">SYS STATUS: ONLINE</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-violet-500/10 text-violet-400 glow-violet border border-violet-500/30"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-sm">
            AN
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Analyst Node 01</span>
            <span className="text-xs text-zinc-400">SOC Tier-3 Agent</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
