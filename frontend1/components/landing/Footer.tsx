import Link from "next/link";
import { Shield, Globe, Mail, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white tracking-tight">TrustMatrix</span>
            </Link>
            <p className="text-zinc-400 font-light max-w-sm mb-8 leading-relaxed">
              The autonomous intelligence layer for Insider Threat Detection & UEBA AI SOC Platform. Stay one step ahead of anomalous behaviors.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/15 transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/15 transition-all">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/15 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-zinc-400 hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="/dashboard" className="text-zinc-400 hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} TrustMatrix AI SOC. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
