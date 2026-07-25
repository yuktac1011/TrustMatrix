import { Search, PlayCircle, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-20 border-b border-zinc-200 dark:border-white/5 glass-panel flex items-center justify-between px-8 shrink-0 z-10">
      <div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-violet-500 dark:group-focus-within:text-violet-400 transition-colors" />
          <input
            type="text"
            placeholder="Search identities, logs..."
            className="w-64 bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-zinc-500 dark:placeholder:text-zinc-600 text-zinc-800 dark:text-zinc-200"
          />
        </div>

        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          {isDark ? <Sun className="w-5 h-5 text-zinc-400 hover:text-white" /> : <Moon className="w-5 h-5 text-zinc-600 hover:text-black" />}
        </button>
        
        <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-full font-medium transition-all glow-violet text-sm">
          <PlayCircle className="w-4 h-4" />
          Quick Run
        </button>
      </div>
    </header>
  );
}
