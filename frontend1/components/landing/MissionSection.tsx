"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, Zap, ShieldAlert, Cpu } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MissionSection() {
  const container = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const points = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Real-time Detection",
      desc: "Process millions of events instantaneously to catch anomalies."
    },
    {
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      title: "AI-Driven Accuracy",
      desc: "Eliminate false positives with ensemble ML models."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-emerald-400" />,
      title: "Automated Response",
      desc: "Isolate compromised entities immediately with SOAR playbooks."
    }
  ];

  useGSAP(() => {
    // Text container fade in
    gsap.from(textRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });

    // Stagger feature points
    gsap.from(".mission-point", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 70%",
      }
    });

    // Visual scale up
    gsap.from(visualRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      delay: 0.2,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });

    // Target rings stagger
    gsap.from(".target-ring", {
      scale: 0,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: visualRef.current,
        start: "top 80%",
      }
    });

    // Pulsing center dot
    gsap.to(".pulsing-dot", {
      scale: 1.2,
      opacity: 1,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });

  }, { scope: container });

  return (
    <section ref={container} className="py-32 relative bg-transparent border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
          <div ref={textRef} className="flex-1 opacity-100">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-sm tracking-wider uppercase mb-6">
              <Target className="w-5 h-5" />
              <span>Our Mission</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Empowering the Modern <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                Security Analyst
              </span>
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed font-light mb-10">
              Our mission is to replace fragile, static SIEM rules with continuous, adaptive behavioral intelligence. We empower analysts by reducing alert fatigue and providing an AI Copilot that instantly contextualizes complex attack vectors.
            </p>
            
            <div className="space-y-6">
              {points.map((point, i) => (
                <div 
                  key={i}
                  className="mission-point flex items-start gap-4 p-5 rounded-2xl bg-[#0d1527] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] hover:border-emerald-500/40 hover:bg-[#121b30] transition-all"
                >
                  <div className="p-3 rounded-lg bg-black/50 border border-white/5">
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{point.title}</h3>
                    <p className="text-zinc-400">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div ref={visualRef} className="flex-1 relative opacity-100">
            {/* Visual element representing precision/mission */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
              
              {/* Target rings */}
              {[1, 2, 3, 4].map((ring) => (
                <div 
                  key={ring}
                  className="target-ring absolute inset-0 border border-emerald-500/20 rounded-full m-auto opacity-100"
                  style={{ width: `${ring * 25}%`, height: `${ring * 25}%` }}
                />
              ))}
              
              <div className="absolute inset-0 m-auto w-1 h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"></div>
              <div className="absolute inset-0 m-auto h-1 w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
              
              <div 
                className="pulsing-dot absolute inset-0 m-auto w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.8)] opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
