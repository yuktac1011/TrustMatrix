"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import OverviewTab from "@/components/views/OverviewTab";
import IngestorTab from "@/components/views/IngestorTab";
import BaselinesTab from "@/components/views/BaselinesTab";
import MLSimulatorTab from "@/components/views/MLSimulatorTab";
import CopilotTab from "@/components/views/CopilotTab";
import NLPTopicTab from "@/components/views/NLPTopicTab";
import BenchmarkTab from "@/components/views/BenchmarkTab";
import SOARTab from "@/components/views/SOARTab";
import { ShieldCheck, Cpu, Terminal, Radio } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderView = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab key="overview" />;
      case "ingestor": return <IngestorTab key="ingestor" />;
      case "baselines": return <BaselinesTab key="baselines" />;
      case "simulator": return <MLSimulatorTab key="simulator" />;
      case "copilot": return <CopilotTab key="copilot" />;
      case "nlp": return <NLPTopicTab key="nlp" />;
      case "benchmark": return <BenchmarkTab key="benchmark" />;
      case "soar": return <SOARTab key="soar" />;
      default: return <OverviewTab key="overview" />;
    }
  };

  const titles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "SOC Overview", subtitle: "Real-time anomaly telemetry & threat index tracking" },
    ingestor: { title: "Log Ingestor", subtitle: "Simulate and push raw payloads to the ingestion pipeline" },
    baselines: { title: "User Baselines", subtitle: "Behavioral profile lookups and operational patterns" },
    simulator: { title: "ML Simulator", subtitle: "Behavior Parameter Simulation and AI evaluation" },
    copilot: { title: "AI SOC Copilot", subtitle: "AI-driven threat analysis and incident resolution summaries" },
    nlp: { title: "NLP Topic Engine", subtitle: "LDA semantic anomaly detection on document and file access patterns" },
    benchmark: { title: "CERT Benchmark", subtitle: "True Detection Rate evaluation on CERT R6.2 insider threat dataset" },
    soar: { title: "SOAR Playbooks", subtitle: "One-click Security Orchestration, Automation and Response actions" },
  };

  return (
    <div className="flex h-screen w-full bg-[#090d16] text-[#e2e8f0] font-sans overflow-hidden">
      {/* Cyber-Rail Navigation Dock (Left) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace (Right) */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          title={titles[activeTab]?.title || "SOC Overview"}
          subtitle={titles[activeTab]?.subtitle || "Autonomous Threat Hunter"}
        />

        {/* Content Viewport with Framer Motion Page Transition */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative bg-[#090d16]">
          <div className="max-w-[1650px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Cyberpunk Footer Telemetry Strip */}
        <footer className="h-9 px-6 bg-[#01021a] border-t border-[#172554] flex items-center justify-between text-[11px] font-mono shrink-0 z-20">
          <div className="flex items-center gap-6 text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#86efac] animate-pulse" />
              <span className="text-[#86efac] font-bold">SYSTEM STATUS:</span> NOMINAL
            </div>
            <div className="flex items-center gap-1.5 hidden md:flex">
              <Cpu className="w-3 h-3 text-[#38bdf8]" />
              <span className="text-zinc-300">ISOLATION_FOREST:</span> ONLINE
            </div>
            <div className="flex items-center gap-1.5 hidden md:flex">
              <Terminal className="w-3 h-3 text-[#a78bfa]" />
              <span className="text-zinc-300">AUTOENCODER:</span> PASSING
            </div>
            <div className="flex items-center gap-1.5 hidden lg:flex">
              <Radio className="w-3 h-3 text-amber-400" />
              <span className="text-zinc-300">LDA_TOPICS:</span> ACTIVE
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-400 hidden sm:inline">CERT R6.2 AUC: 92.4%</span>
            <div className="flex items-center gap-1 text-[#86efac] font-bold bg-[#86efac]/10 px-2 py-0.5 rounded border border-[#86efac]/30">
              <ShieldCheck className="w-3 h-3" />
              <span>SOAR ENGINE: 6 PLAYBOOKS READY</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
