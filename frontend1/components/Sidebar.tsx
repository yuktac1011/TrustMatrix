"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldHalf, Activity, Server, Users, Cpu, Bot, Brain, BarChart3, Shield,
  Radio
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const navGroups = [
    {
      groupTitle: "OPS",
      items: [
        { id: "overview", label: "SOC Dashboard", icon: Activity, badge: "LIVE" },
        { id: "ingestor", label: "Log Ingestor", icon: Server },
      ],
    },
    {
      groupTitle: "AI",
      items: [
        { id: "baselines", label: "User Baselines", icon: Users },
        { id: "simulator", label: "ML Simulator", icon: Cpu },
        { id: "nlp", label: "LDA Topic Engine", icon: Brain, badge: "NLP" },
      ],
    },
    {
      groupTitle: "RESPONSE",
      items: [
        { id: "copilot", label: "AI SOC Copilot", icon: Bot, badge: "AI" },
        { id: "benchmark", label: "CERT Benchmark", icon: BarChart3, badge: "TDR" },
        { id: "soar", label: "SOAR Playbooks", icon: Shield, badge: "1-CLICK" },
      ],
    },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-panel border-r border-[#172554] flex flex-col h-full bg-[#01021a]/95 z-30 transition-all duration-300 ease-in-out shadow-[4px_0_30px_rgba(0,0,0,0.6)] ${
        isHovered ? "w-64" : "w-18"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#172554] bg-[#01021a]">
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 rounded-xl bg-[#86efac]/10 border border-[#86efac]/40 flex items-center justify-center shrink-0 glow-primary cursor-pointer"
          >
            <ShieldHalf className="w-6 h-6 text-[#86efac]" />
          </motion.div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="whitespace-nowrap"
            >
              <span className="font-extrabold text-lg tracking-wider text-white">
                TRUST<span className="text-[#86efac]">MATRIX</span>
              </span>
              <div className="text-[9px] font-mono text-[#86efac]">UEBA Threat Hunter</div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 py-4 px-2 space-y-5 overflow-y-auto overflow-x-hidden">
        {navGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            {isHovered ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 text-[10px] font-mono font-bold text-[#86efac]/80 uppercase tracking-widest flex items-center gap-1.5 py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] animate-pulse" />
                {group.groupTitle}
              </motion.div>
            ) : (
              <div className="w-full flex justify-center py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#86efac]/40" />
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  title={!isHovered ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 relative group cursor-pointer ${
                    isActive
                      ? "bg-[#172554] text-[#86efac] font-bold border border-[#86efac]/40 shadow-[0_0_15px_rgba(134,239,172,0.2)]"
                      : "text-zinc-400 hover:text-white hover:bg-[#172554]/40 border border-transparent"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#86efac]" : "text-zinc-400 group-hover:text-white"}`} />

                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between flex-1 min-w-0"
                    >
                      <span className="text-xs truncate tracking-wide">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ml-2 shrink-0 ${
                            isActive
                              ? "bg-[#86efac] text-[#01021a]"
                              : "bg-[#090d16] text-[#86efac] border border-[#172554]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}

                  {!isHovered && isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-1 w-1.5 h-6 rounded-full bg-[#86efac] glow-primary"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Analyst Card */}
      <div className="p-3 border-t border-[#172554] bg-[#090d16]/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#01021a] border border-[#172554]">
          <div className="w-8 h-8 rounded-full bg-[#86efac] text-[#01021a] font-bold text-xs flex items-center justify-center shrink-0 glow-primary">
            AN
          </div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col text-left min-w-0"
            >
              <span className="text-xs font-bold text-white truncate">SOC Tier-3 Analyst</span>
              <span className="text-[9px] text-[#86efac] font-mono flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> Active
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </aside>
  );
}
