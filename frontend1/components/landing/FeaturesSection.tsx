"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrainCircuit, Shield, Fingerprint, Activity } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturesSection() {
  const container = useRef<HTMLElement>(null);

  const features = [
    {
      title: "AI SOC Copilot",
      desc: "Generative AI instantly analyzes complex logs and provides plain-English threat summaries, reducing analyst investigation time by 90%.",
      icon: <BrainCircuit className="w-8 h-8 text-blue-400" />,
      color: "from-blue-500/20 to-transparent",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Isolation Forest Anomaly Detection",
      desc: "Unsupervised machine learning identifies novel attack vectors and insider threats that evade traditional signature-based rules.",
      icon: <Activity className="w-8 h-8 text-emerald-400" />,
      color: "from-emerald-500/20 to-transparent",
      borderColor: "border-emerald-500/20"
    },
    {
      title: "Behavioral Baselines",
      desc: "Automatically profile users and entities. Any deviation from the established baseline immediately spikes the risk index.",
      icon: <Fingerprint className="w-8 h-8 text-amber-400" />,
      color: "from-amber-500/20 to-transparent",
      borderColor: "border-amber-500/20"
    },
    {
      title: "SOAR Playbooks",
      desc: "Take autonomous action. One-click isolate hosts, disable compromised accounts, or block malicious IPs in real-time.",
      icon: <Shield className="w-8 h-8 text-rose-400" />,
      color: "from-rose-500/20 to-transparent",
      borderColor: "border-rose-500/20"
    }
  ];

  useGSAP(() => {
    // Header texts
    gsap.fromTo(
      ".feature-header",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom-=50px",
        }
      }
    );

    // Cards stagger
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom-=50px",
        }
      }
    );

  }, { scope: container });

  return (
    <section ref={container} id="features" className="py-32 relative bg-transparent border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="feature-header text-4xl md:text-5xl font-bold text-white mb-6">
            Core Capabilities
          </h2>
          <p className="feature-header text-xl text-zinc-300 max-w-2xl mx-auto font-light">
            A full suite of autonomous hunting tools designed to outsmart the most sophisticated insider threats.
          </p>
        </div>

        <div className="feature-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className={`feature-card relative overflow-hidden rounded-3xl bg-[#0d1527] border ${feature.borderColor} p-8 shadow-[0_12px_40px_rgba(0,0,0,0.8)] transition-all hover:-translate-y-1.5 hover:bg-[#121b30] hover:border-white/30`}
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${feature.color} rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none`}></div>
              
              <div className="relative z-10">
                <div className="mb-6 p-4 inline-block bg-[#050810] rounded-2xl border border-white/10 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-zinc-300 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
