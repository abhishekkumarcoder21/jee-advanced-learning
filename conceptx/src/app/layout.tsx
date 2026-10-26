import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "ConceptX — Interactive Learning for JEE Advanced",
  description: "Understand the concept. Visualize the solution. An AI-powered interactive learning platform that helps JEE Advanced aspirants master difficult examination questions through interactive visualizations, step-by-step explanations, and AI tutoring.",
  keywords: ["JEE Advanced", "Physics", "Chemistry", "Mathematics", "Interactive Learning", "Visualization", "AI Tutor"],
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Suspense fallback={<div style={{ height: 'var(--header-height)' }} />}>
          <Header />
        </Suspense>
        <main className="flex-1" style={{ paddingTop: 'var(--header-height)' }}>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading learning workspace...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
