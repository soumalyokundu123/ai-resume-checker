import { motion } from "framer-motion";
import { Star, CheckCircle, TrendingUp } from "lucide-react";
import { SectionHeader } from "./FeaturesSection";

const COMMUNITY_REVIEWS = [
  {
    quote:
      "I was applying for 3 months with 0 callbacks. The keyword breakdown showed my resume had 'Docker' but was missing 'Kubernetes' and 'CI/CD' for SRE roles. Added real project bullets, and landed 2 phone screens the following week.",
    name: "Bhumi Prasad",
    role: "Full-Stack Intern",
    tag: "College ERP & DA Systems",
    scoreBefore: 58,
    scoreAfter: 89,
    initials: "BP",
  },
  {
    quote:
      "Most AI resume tools just output buzzword fluff. Roaster actually rewrote my bullet points with quantified numbers and metrics that recruiters care about. It actually sounds like an engineer wrote it.",
    name: "Alexey Morozov",
    role: "Backend Engineer",
    tag: "Remote SWE",
    scoreBefore: 64,
    scoreAfter: 91,
    initials: "AM",
  },
  {
    quote:
      "The diff comparison feature is gold. Being able to compare Version 1 vs Version 3 line-by-line saved me hours of manually editing Word docs before submitting applications.",
    name: "Elena Rostova",
    role: "Senior QA Engineer",
    tag: "Targeting Lead SWE",
    scoreBefore: 71,
    scoreAfter: 94,
    initials: "ER",
  },
  {
    quote:
      "As a new CS grad, I had no clue applicant tracking systems like Greenhouse were auto-rejecting me because of two-column table layouts. Exported the clean ATS PDF and got through immediately.",
    name: "Rohan Patel",
    role: "New CS Graduate",
    tag: "Class of '25",
    scoreBefore: 52,
    scoreAfter: 86,
    initials: "RP",
  },
  {
    quote:
      "The issue analysis is brutally honest but extremely actionable. Highlighted 5 weak verbs and suggested exact replacements with business outcomes. Worth every minute.",
    name: "Ananya Deshmukh",
    role: "Frontend Developer",
    tag: "React & TypeScript",
    scoreBefore: 67,
    scoreAfter: 92,
    initials: "AD",
  },
  {
    quote:
      "Used it the night before submitting to a fast-growing tech startup. Recruiter messaged me on LinkedIn 36 hours later saying the bullet metrics stood out in the applicant pool.",
    name: "Carlos Gomez",
    role: "Junior Web Developer",
    tag: "Bootcamp Graduate",
    scoreBefore: 59,
    scoreAfter: 88,
    initials: "CG",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="px-4 sm:px-6 mt-28 sm:mt-36"
      style={{ maxWidth: 1280, marginLeft: "auto", marginRight: "auto" }}
    >
      <SectionHeader
        eyebrow="Community Proof"
        title={
          <>
            Real feedback from{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent font-bold">
              real job seekers.
            </span>
          </>
        }
        sub="From new grads landing their first SWE role to engineers making career leaps."
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMMUNITY_REVIEWS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative rounded-[24px] bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden"
          >
            {/* Top subtle highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1 text-emerald-500">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                {/* Score improvement pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold font-mono">
                  <TrendingUp size={12} />
                  <span>{t.scoreBefore} &rarr; {t.scoreAfter}</span>
                </div>
              </div>

              <p className="text-[14px] text-[var(--ink)] leading-relaxed relative z-10 font-normal">
                "{t.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-[var(--border)]">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-display text-xs font-bold shadow-xs shrink-0">
                {t.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[var(--ink)] flex items-center gap-1.5 truncate">
                  {t.name}
                  <CheckCircle size={13} className="text-emerald-500 shrink-0" title="Verified User" />
                </div>
                <div className="text-xs text-[var(--ink-muted)] truncate">
                  {t.role} &bull; <span className="text-[var(--ink-muted)]/80">{t.tag}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
