import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { profile } from "@/content/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "vietnamese"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: `${profile.name} · ${profile.role}`,
  description: profile.intro,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
