import { useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreviewSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  // Landing always reads on light background — but app-wide theme persists.
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "light");
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
    };
  }, []);

  return (
    <div
      data-theme="light"
      className="min-h-screen bg-[var(--bg)] text-[var(--ink)] overflow-x-hidden"
      style={{
        "--bg": "#f4f4f0",
        "--surface": "#ffffff",
        "--surface-2": "#fafaf7",
        "--border": "rgba(15, 17, 21, 0.08)",
        "--ink": "#0f1115",
        "--ink-muted": "#374151",
        "--accent": "#5b7c6a",
        "--accent-strong": "#2f4a3a",
        "--accent-soft": "#e6efe8",
        colorScheme: "light",
      }}
    >
      <Navbar />
      <main style={{ background: "white" }}>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <DashboardPreviewSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
