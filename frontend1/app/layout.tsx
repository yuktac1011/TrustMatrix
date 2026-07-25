import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustMatrix // UEBA AI SOC Platform",
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
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <body className="h-full flex flex-col bg-black text-zinc-100 overflow-hidden" suppressHydrationWarning>{children}</body>
    </html>
  );
}
