import { ShieldHalf, Activity, Server, Users, Cpu, Bot, Brain, BarChart3, Shield } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: Activity },
    { id: "ingestor", label: "Log Ingestor", icon: Server },
    { id: "baselines", label: "User Baselines", icon: Users },
    { id: "simulator", label: "ML Simulator", icon: Cpu },
    { id: "copilot", label: "AI SOC Copilot", icon: Bot },
    { id: "nlp", label: "NLP Topic Engine", icon: Brain },
    { id: "benchmark", label: "CERT Benchmark", icon: BarChart3 },
    { id: "soar", label: "SOAR Playbooks", icon: Shield },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-zinc-200 dark:border-white/5 flex flex-col h-full bg-white/40 dark:bg-black/40 z-10">
      <div className="p-6 flex items-center gap-3">
        <ShieldHalf className="w-8 h-8 text-violet-600 dark:text-violet-500" />
        <span className="font-bold text-xl tracking-wider text-black dark:text-white">
          TRUST<span className="text-violet-600 dark:text-violet-500">MATRIX</span>
        </span>
      </div>

      <div className="px-6 pb-4 text-xs font-bold text-zinc-500 tracking-widest uppercase">
        Menu
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-all duration-300 ${
                isActive
                  ? "sidebar-active-gradient text-black dark:text-white font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-sm text-white">
            AN
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-black dark:text-white">Username</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">SOC Tier-3</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
