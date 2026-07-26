"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-20">
      {/* Radial Gradient Overlay to blend content into the background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#090d16]/60 to-[#090d16]/90"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="mb-8 flex justify-center overflow-hidden">
            <pre className="text-[6px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base font-mono text-emerald-400 leading-tight select-none tracking-tighter whitespace-pre drop-shadow-[0_0_25px_rgba(52,211,153,0.7)]">
{`████████╗██████╗ ██╗   ██╗███████╗████████╗███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
   ██║   ██████╔╝██║   ██║███████╗   ██║   ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
   ██║   ██╔══██╗██║   ██║╚════██║   ██║   ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
   ██║   ██║  ██║╚██████╔╝███████║   ██║   ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝`}
            </pre>
          </div>
          
          <p className="mt-4 text-xl md:text-2xl text-zinc-100 max-w-3xl mx-auto font-medium drop-shadow-lg leading-relaxed mb-10">
            Continuously profile entity behavior, detect anomalies in real-time, and automate remediation with our AI-driven Security Operations Center.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative">Launch Dashboard</span>
                <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-0.5 h-12 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
