import type { Metadata } from "next";
import { Inter, JetBrains_Mono, DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { ViewModeProvider } from "@/lib/ViewMode";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Benjamin Schindler · CTO & AI Engineer",
  description:
    "CTO at Doctor911 · MSc Data Science · Building agentic systems, RAG, and production AI. Interactive portfolio with animated visualizations.",
  metadataBase: new URL("https://benjaminschindler.vercel.app"),
  openGraph: {
    title: "Benjamin Schindler · CTO & AI Engineer",
    description:
      "Interactive portfolio: animated multi-agent graph, time-series forecasting, NL→SQL pipeline, and a live thesis scatter on geometric LLM filtering.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benjamin Schindler · CTO & AI Engineer",
    description: "Interactive portfolio with animated AI/ML visualizations.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} ${dmSans.variable} ${dmSerif.variable} concise h-full antialiased`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "::view-transition-old(root),::view-transition-new(root){animation-duration:380ms;animation-timing-function:cubic-bezier(.4,0,.2,1)}@media (prefers-reduced-motion:reduce){::view-transition-old(root),::view-transition-new(root){animation-duration:1ms}}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--accent)] focus:text-black focus:px-3 focus:py-1.5 focus:rounded"
        >
          Skip to content
        </a>
        <ViewModeProvider>{children}</ViewModeProvider>
      </body>
    </html>
  );
}
