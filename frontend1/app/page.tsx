"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroSection from "@/components/landing/HeroSection";
import VisionSection from "@/components/landing/VisionSection";
import MissionSection from "@/components/landing/MissionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import FaultyTerminal from "@/components/landing/FaultyTerminal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger positions after initialization
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#090d16] text-[#e2e8f0] font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Full Landing Page Fixed Terminal Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.7}
          timeScale={0.8}
          pause={false}
          scanlineIntensity={0.4}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0}
          tint="#10B981"
          mouseReact={true}
          mouseStrength={0.3}
          pageLoadAnimation={false}
          brightness={0.8}
          className=""
          style={{}}
        />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <VisionSection />
        <MissionSection />
        <FeaturesSection />
        <Footer />
      </div>
    </div>
  );
}
