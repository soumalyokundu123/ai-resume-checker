import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileText,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
} from "lucide-react";

export function Hero3DResume() {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 260 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

  // Specular shine gradient follow
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      className="relative w-full max-w-[540px] mx-auto perspective-1200 py-6"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background radial ambient glow */}
      <div
        className="absolute -inset-10 -z-10 rounded-full opacity-60 pointer-events-none transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.08) 45%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Floating Decorative Elements in 3D Space */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -left-4 sm:-left-8 z-30"
        style={{ transform: "translateZ(60px)" }}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#11141A]/90 border border-emerald-500/30 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
          <div className="h-7 w-7 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Sparkles size={14} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              AI Parser Match
            </div>
            <div className="text-xs font-semibold text-white">96% Greenhouse / Lever</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-6 -right-4 sm:-right-8 z-30"
        style={{ transform: "translateZ(70px)" }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#11141A]/95 border border-white/10 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            +32
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-medium">Quantified Impact</div>
            <div className="text-xs font-semibold text-emerald-300">3 Weak Bullets Rewritten</div>
          </div>
          <TrendingUp size={14} className="text-emerald-400" />
        </div>
      </motion.div>

      {/* Main 3D Card */}
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-[26px] bg-[#11141A] border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] p-6 sm:p-7 overflow-hidden transition-shadow duration-300"
      >
        {/* Top-edge specular highlight */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none"
        />

        {/* Dynamic mouse shine overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle 320px at ${shineX} ${shineY}, rgba(255,255,255,0.25), transparent)`,
          }}
        />

        {/* Animated ATS Scanner Line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-scan-line pointer-events-none z-20" />

        {/* Header HUD inside card */}
        <div className="flex items-center justify-between pb-4 border-b border-white/8 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <FileText size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                Staff_Software_Engineer_V2.pdf
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Scanned against ATS 2026 Engine</div>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
            <ShieldCheck size={12} />
            Ready to Ship
          </div>
        </div>

        {/* ATS Score Meter & Category Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-5 items-center relative z-10">
          <div className="sm:col-span-5 flex items-center gap-3 bg-white/[0.03] border border-white/6 rounded-2xl p-3">
            <div className="relative h-14 w-14 rounded-full flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400"
                  strokeDasharray="92, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-lg font-bold text-white leading-none">92</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Overall Score
              </div>
              <div className="text-xs font-medium text-zinc-300">Top 4% Candidate</div>
            </div>
          </div>

          <div className="sm:col-span-7 grid grid-cols-2 gap-2">
            {[
              { label: "Keywords", val: "24/25", color: "text-emerald-400" },
              { label: "Impact", val: "23/25", color: "text-emerald-400" },
              { label: "Formatting", val: "25/25", color: "text-emerald-400" },
              { label: "Clarity", val: "20/25", color: "text-amber-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-xl px-2.5 py-1.5">
                <div className="text-[10px] text-zinc-400">{stat.label}</div>
                <div className={`text-xs font-bold font-mono ${stat.color}`}>{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Rewrite Preview Box */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/8 p-3.5 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Zap size={11} className="text-amber-400" /> AI Rewrite Comparison
            </span>
            <span className="text-emerald-400 text-[10px]">+18 ATS Boost</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 line-through opacity-75">
              "Helped improve database performance and worked on frontend features."
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-100 flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                "Engineered PostgreSQL indexing strategy, reducing query latency by <strong>42%</strong> across <strong>4.2M daily transactions</strong>."
              </span>
            </div>
          </div>
        </div>

        {/* Keyword pill preview */}
        <div className="mt-4 pt-3 border-t border-white/8 flex flex-wrap gap-1.5 items-center relative z-10">
          <span className="text-[10px] font-semibold uppercase text-zinc-400 mr-1">Recognized:</span>
          {["Distributed Systems", "PostgreSQL", "Go", "Docker", "REST APIs", "AWS"].map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-300"
            >
              ✓ {kw}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
