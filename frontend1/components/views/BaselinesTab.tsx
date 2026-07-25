"use client";
import { Search, UserCircle2, Clock, Globe, Laptop, Box } from "lucide-react";

export default function BaselinesTab() {
  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
        <Search className="w-5 h-5 text-violet-500" />
        <input 
          type="text" 
          placeholder="Enter target username (e.g. admin_user, johndoe)..."
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600"
        />
        <button className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl font-medium transition-all glow-violet">
          Retrieve Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-1">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/50 glow-violet">
              <UserCircle2 className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">admin_user</h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">Profile Version: v1.4</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Last Updated</span>
              <span className="text-sm font-medium">Just now</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Avg Daily Bytes</span>
              <span className="text-sm font-medium">1.2 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Max Threshold</span>
              <span className="text-sm font-medium text-orange-400">5.0 GB</span>
            </div>
          </div>

          <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all flex justify-center items-center gap-2">
            Recalculate Baseline
          </button>
        </div>

        {/* Visualizations */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-8">
          <h3 className="text-xl font-semibold border-b border-white/10 pb-4">Operational Patterns & Bounds</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm text-zinc-400 mb-3"><Clock className="w-4 h-4 text-violet-400" /> Typical Working Hours</h4>
              <div className="h-8 flex rounded-md overflow-hidden bg-white/5 border border-white/10">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className={`flex-1 border-r border-white/5 ${i >= 9 && i <= 17 ? 'bg-violet-500/40' : ''}`} title={`${i}:00`} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm text-zinc-400 mb-3"><Globe className="w-4 h-4 text-cyan-400" /> Allowed Geographies</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-sm">United States</span>
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-sm">Canada</span>
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm text-zinc-400 mb-3"><Laptop className="w-4 h-4 text-fuchsia-400" /> Standard Authorized Devices</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 px-3 py-1 rounded-full text-sm">LAPTOP-99121</span>
                <span className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 px-3 py-1 rounded-full text-sm">MACBOOK-PRO-OP</span>
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm text-zinc-400 mb-3"><Box className="w-4 h-4 text-green-400" /> Frequently Run Applications</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">powershell.exe</span>
                <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">chrome.exe</span>
                <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">slack.exe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
