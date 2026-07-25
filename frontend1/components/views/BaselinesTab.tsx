"use client";
import { Search, UserCircle2, Clock, Globe, Laptop, Box } from "lucide-react";
import { useState } from "react";
import { fetchBaseline, recalculateBaseline } from "../../lib/api";

export default function BaselinesTab() {
  const [usernameInput, setUsernameInput] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!usernameInput) return;
    setLoading(true);
    try {
      const data = await fetchBaseline(usernameInput.trim());
      setProfile(data);
    } catch (e) {
      alert("Failed to fetch baseline or user not found.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    if (!profile) return;
    try {
      const mockEvents = [{
        timestamp: new Date().toISOString(),
        user: profile.username,
        entity: "vpn_service",
        device: "LAPTOP-552",
        event_type: "LOGIN_SUCCESS",
        severity: 1,
        bytes_transferred: 3200000,
        location: "UK"
      }];
      const data = await recalculateBaseline(profile.username, mockEvents);
      setProfile(data);
    } catch (e) {
      alert("Recalculation failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
        <Search className="w-5 h-5 text-violet-500" />
        <input 
          type="text" 
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          placeholder="Enter target username (e.g. admin_user, johndoe)..."
          className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600"
        />
        <button 
          onClick={handleFetch}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl font-medium transition-all glow-violet disabled:opacity-50">
          {loading ? "Searching..." : "Retrieve Profile"}
        </button>
      </div>

      {!profile ? (
        <div className="text-center text-zinc-500 py-12">Search for a user to view their baseline profile and operational bounds.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="glass-panel p-6 rounded-2xl lg:col-span-1">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-white/10">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/50 glow-violet shrink-0">
                <UserCircle2 className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black dark:text-white break-all">{profile.username}</h3>
                <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full border border-green-500/30 inline-block mt-2">
                  Profile Version: v{profile.profile_score_version || 1}
                </span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">Last Updated</span>
                <span className="text-sm font-medium text-black dark:text-white">{new Date(profile.last_updated).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">Avg Daily Bytes</span>
                <span className="text-sm font-medium text-black dark:text-white">{(profile.avg_daily_bytes / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">Max Threshold</span>
                <span className="text-sm font-medium text-orange-500 dark:text-orange-400">{(profile.max_daily_bytes_threshold / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>

            <button 
              onClick={handleRecalculate}
              className="w-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 text-black dark:text-white px-4 py-3 rounded-xl text-sm font-medium transition-all flex justify-center items-center gap-2">
              Recalculate Baseline
            </button>
          </div>

          {/* Visualizations */}
          <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-8">
            <h3 className="text-xl font-semibold border-b border-zinc-200 dark:border-white/10 pb-4 text-black dark:text-white">Operational Patterns & Bounds</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3"><Clock className="w-4 h-4 text-violet-500 dark:text-violet-400" /> Typical Working Hours</h4>
                <div className="h-8 flex rounded-md overflow-hidden bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                  {[...Array(24)].map((_, i) => {
                    const isActive = profile.typical_working_hours?.includes(i);
                    return (
                      <div key={i} className={`flex-1 border-r border-zinc-200 dark:border-white/5 ${isActive ? 'bg-violet-500/40' : ''}`} title={`${i}:00`} />
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3"><Globe className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Allowed Geographies</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.allowed_locations?.map((loc: string, idx: number) => (
                    <span key={idx} className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-sm">{loc}</span>
                  ))}
                  {!profile.allowed_locations?.length && <span className="text-zinc-500 text-sm">None recorded</span>}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3"><Laptop className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" /> Standard Authorized Devices</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.allowed_devices?.map((dev: string, idx: number) => (
                    <span key={idx} className="bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/30 px-3 py-1 rounded-full text-sm">{dev}</span>
                  ))}
                  {!profile.allowed_devices?.length && <span className="text-zinc-500 text-sm">None recorded</span>}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3"><Box className="w-4 h-4 text-green-500 dark:text-green-400" /> Frequently Run Applications</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.frequent_applications?.map((app: string, idx: number) => (
                    <span key={idx} className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">{app}</span>
                  ))}
                  {!profile.frequent_applications?.length && <span className="text-zinc-500 text-sm">None recorded</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
