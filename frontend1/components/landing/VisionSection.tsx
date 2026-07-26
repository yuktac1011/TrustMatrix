"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VisionSection() {
  const container = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(textRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });

    gsap.from(visualRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-32 relative bg-transparent border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div ref={textRef} className="flex-1 opacity-100">
            <div className="inline-flex items-center gap-2 text-blue-400 font-mono text-sm tracking-wider uppercase mb-6">
              <Eye className="w-5 h-5" />
              <span>Our Vision</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              A World Where Threats <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Never Materialize
              </span>
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed font-light">
              We envision a security landscape where organizations are no longer reactive. By creating an autonomous intelligence layer, we aim to intercept insider threats and compromised accounts before data exfiltration occurs, turning the SOC into a proactive, self-healing nerve center.
            </p>
          </div>
          
          <div ref={visualRef} className="flex-1 relative opacity-100">
            <div className="aspect-square relative max-w-md mx-auto">
              {/* Abstract visual for vision */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-10 border border-white/10 rounded-full flex items-center justify-center">
                <div className="absolute inset-10 border border-blue-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-20 border border-emerald-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                <Eye className="w-20 h-20 text-blue-400/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
