import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import ClientBody from "./ClientBody";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "YieldMarket - Trading Platform",
  description: "Advanced trading platform for yield markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased dark bg-zinc-950 text-zinc-50 font-sans select-none`}
      >
        <ClientBody>
          {children}
        </ClientBody>
        <Toaster richColors position="top-center" theme="dark" />
      </body>
    </html>
  );
}
