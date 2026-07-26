import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "TrustMatrix",
  description: "User & Entity Behavior Analytics Dashboard for Insider Risk Management",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark antialiased", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#090d16] text-zinc-100 overflow-x-hidden" suppressHydrationWarning>{children}</body>
    </html>
  );
}
