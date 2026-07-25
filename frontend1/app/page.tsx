"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import OverviewTab from "@/components/views/OverviewTab";
import IngestorTab from "@/components/views/IngestorTab";
import BaselinesTab from "@/components/views/BaselinesTab";
import MLSimulatorTab from "@/components/views/MLSimulatorTab";
import CopilotTab from "@/components/views/CopilotTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderView = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "ingestor": return <IngestorTab />;
      case "baselines": return <BaselinesTab />;
      case "simulator": return <MLSimulatorTab />;
      case "copilot": return <CopilotTab />;
      default: return <OverviewTab />;
    }
  };

  const titles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "SOC Overview", subtitle: "Real-time anomaly telemetry & threat index tracking" },
    ingestor: { title: "Log Ingestor", subtitle: "Simulate and push raw payloads to the ingestion pipeline" },
    baselines: { title: "User Baselines", subtitle: "Behavioral profile lookups and operational patterns" },
    simulator: { title: "ML Simulator", subtitle: "Behavior Parameter Simulation and AI evaluation" },
    copilot: { title: "AI SOC Copilot", subtitle: "AI-driven threat analysis and incident resolution summaries" }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-zinc-100 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          title={titles[activeTab].title} 
          subtitle={titles[activeTab].subtitle} 
        />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-[1400px] mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
