import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import type { CSSProperties } from "react";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import "./globals.css";

const STAR_COUNT = 50;
type StarStyle = CSSProperties & Record<'--star-size' | '--twinkle-duration' | '--twinkle-delay' | '--star-opacity' | '--star-blur', string>;

function pseudoRandom(index: number, offset: number): number {
  const value = Math.sin(index * 12.9898 + offset) * 43758.5453;
  return value - Math.floor(value);
}

const STAR_STYLES: StarStyle[] = Array.from({ length: STAR_COUNT }, (_, index) => ({
  left: `${pseudoRandom(index, 1.23) * 100}%`,
  top: `${pseudoRandom(index, 4.56) * 100}%`,
  '--star-size': `${Math.round(pseudoRandom(index, 2.34) * 7 + 7)}px`,
  '--twinkle-duration': `${(pseudoRandom(index, 3.45) * 3.8 + 2.4).toFixed(2)}s`,
  '--twinkle-delay': `${(pseudoRandom(index, 4.56) * 5.5).toFixed(2)}s`,
  '--star-opacity': `${(pseudoRandom(index, 5.67) * 0.55 + 0.35).toFixed(2)}`,
  '--star-blur': `${(pseudoRandom(index, 6.78) * 3.5 + 1).toFixed(2)}px`,
}));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "塔罗占卜 - Tarot Reading",
  description: "探索命运的奥秘，获取塔罗牌的智慧指引",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased min-h-svh`}
      >
        <div className="cosmic-rotating-bg" />
        <BackgroundMusic />
        {/* 星星背景装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
          {STAR_STYLES.map((style, i) => (
            <div
              key={i}
              className="absolute star-cross"
              style={style}
            />
          ))}
        </div>
        <div className="relative z-20">
          {children}
        </div>
      </body>
    </html>
  );
}
