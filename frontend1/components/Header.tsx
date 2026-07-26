"use client";
import { Search, PlayCircle, ShieldAlert, Radio, Activity, Cpu } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-[#172554] glass-panel bg-[#01021a]/90 flex items-center justify-between px-6 shrink-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#86efac] tracking-wider uppercase">
            <span>TRUSTMATRIX</span>
            <span>//</span>
            <span>SOC COMMAND</span>
          </div>
          <h1 className="text-lg font-extrabold text-white tracking-wide leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center Tactical Telemetry Ticker Strip */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d16] border border-[#172554]">
          <Radio className="w-3.5 h-3.5 text-[#86efac] animate-pulse" />
          <span className="text-zinc-400">TELEMETRY:</span>
          <span className="text-white font-bold">1,482 EPS</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d16] border border-[#172554]">
          <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="text-zinc-400">RISK INDEX:</span>
          <span className="text-[#38bdf8] font-bold">42.8%</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d16] border border-[#172554]">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span className="text-zinc-400">CRITICAL:</span>
          <span className="text-red-400 font-bold">3 PENDING</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search identities, logs..."
            className="w-52 bg-[#090d16] border border-[#172554] rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#86efac] text-white"
          />
        </div>

      </div>
    </header>
  );
}
