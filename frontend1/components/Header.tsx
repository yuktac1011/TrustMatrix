import { Search, PlayCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-20 border-b border-white/5 glass-panel flex items-center justify-between px-8 bg-black/20 shrink-0">
      <div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          {title}
        </h1>
        <p className="text-sm text-zinc-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
          <input
            type="text"
            placeholder="Search identities, logs..."
            className="w-64 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-zinc-600"
          />
        </div>
        
        <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-full font-medium transition-all glow-violet text-sm">
          <PlayCircle className="w-4 h-4" />
          Quick Run
        </button>
      </div>
    </header>
  );
}
