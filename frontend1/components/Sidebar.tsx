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
    <aside className="w-64 glass-panel border-r border-[#172554] flex flex-col h-full bg-[#01021a]/90 z-10">
      <div className="p-6 flex items-center gap-3">
        <ShieldHalf className="w-8 h-8 text-[#86efac]" />
        <span className="font-bold text-xl tracking-wider text-white">
          TRUST<span className="text-[#86efac]">MATRIX</span>
        </span>
      </div>

      <div className="px-6 pb-4 text-xs font-bold text-zinc-400 tracking-widest uppercase">
        Navigation
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
                  ? "sidebar-active-gradient text-[#86efac] font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-[#172554]/40 border-l-2 border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#86efac]" : "text-zinc-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#172554]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#111827] border border-[#172554]">
          <div className="w-10 h-10 rounded-full bg-[#86efac] flex items-center justify-center font-bold text-sm text-[#111827] shadow-[0_0_10px_rgba(134,239,172,0.4)]">
            AN
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-white">Analyst</span>
            <span className="text-xs text-[#86efac]">SOC Tier-3 Lead</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

