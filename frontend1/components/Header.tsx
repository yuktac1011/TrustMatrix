import { Search, PlayCircle, ShieldAlert } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-20 border-b border-[#172554] glass-panel bg-[#01021a]/80 flex items-center justify-between px-8 shrink-0 z-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">
          {title}
        </h1>
        <p className="text-xs text-[#cbd5e1]/70">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#86efac] transition-colors" />
          <input
            type="text"
            placeholder="Search identities, logs..."
            className="w-64 bg-[#111827] border border-[#172554] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#86efac] focus:ring-1 focus:ring-[#86efac]/50 transition-all placeholder:text-zinc-500 text-white"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172554]/60 border border-[#172554] text-xs font-semibold text-[#86efac]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#86efac]" />
          <span>System Status: Online</span>
        </div>

        <button className="flex items-center gap-2 bg-[#86efac] hover:bg-[#86efac]/90 text-[#111827] px-4 py-2 rounded-full font-semibold transition-all glow-primary text-sm shadow-[0_0_12px_rgba(134,239,172,0.3)]">
          <PlayCircle className="w-4 h-4" />
          Run Simulation
        </button>
      </div>
    </header>
  );
}

