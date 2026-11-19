import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { DarkPanel } from "./DarkPanel";
import { Hero3DResume } from "./Hero3DResume";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <DarkPanel
        className="w-full min-h-[780px] lg:min-h-[860px]"
        radius="rounded-b-[40px] sm:rounded-b-[56px]"
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center px-6 sm:px-10 lg:px-16 pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24"
          style={{ maxWidth: 1320, marginLeft: "auto", marginRight: "auto" }}
        >
          {/* Copy */}
          <div className="text-white relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-emerald-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] tracking-wider text-emerald-300 uppercase font-bold">
                Next-Gen ATS Parser &bull; Gemini 2.5
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-[46px] sm:text-[62px] lg:text-[76px] leading-[1.02] tracking-tight mt-6"
            >
              Beat the ATS.
              <br />
              <span className="text-zinc-400">Land 3x more</span>{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent font-bold">
                interviews.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-zinc-300 text-base sm:text-lg lg:text-[18px] mt-6 max-w-[560px] leading-relaxed"
            >
              Upload your resume for real-time parsing against Greenhouse and Lever algorithms.
              Get quantifiable impact scores, identify missing keywords, and rewrite weak bullets
              with surgical precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex flex-wrap items-center gap-3.5 mt-8"
            >
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2.5 h-13 px-6 rounded-full font-semibold text-[14px] text-white shadow-[0_12px_32px_rgba(16,185,129,0.35)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #10B981 0%, #059669 60%, #047857 100%)",
                }}
              >
                <span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)",
                  }}
                />
                <span className="relative flex items-center gap-2">
                  <Zap size={16} className="text-emerald-100 fill-emerald-100" />
                  Roast My Resume Free
                </span>
                <ArrowRight size={15} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 h-13 px-5 rounded-full font-medium text-[14px] text-zinc-200 bg-white/[0.05] border border-white/10 backdrop-blur-md hover:bg-white/[0.1] hover:text-white transition-all"
              >
                <Play size={13} fill="currentColor" />
                Watch 60s Demo
              </a>
            </motion.div>

            {/* Metrics Trust Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-white/10 max-w-[500px]"
            >
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  89.4%
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Average ATS Pass Rate</div>
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
                  3.2x
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">More Recruiter Calls</div>
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  &lt; 10s
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Instant Deep Analysis</div>
              </div>
            </motion.div>
          </div>

          {/* Interactive 3D Scanner Column */}
          <div className="relative flex items-center justify-center">
            <Hero3DResume />
          </div>
        </div>
      </DarkPanel>
    </section>
  );
}
