import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUploadResume } from "@/hooks/useResumes";

const MAX_BYTES = 5 * 1024 * 1024;

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadDropzone({ onUploaded, compact = false }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [err, setErr] = useState("");
  const [processingStep, setProcessingStep] = useState(0);
  const upload = useUploadResume();

  const steps = [
    "Reading PDF binary layers...",
    "Parsing AST sections & contact info...",
    "Initializing ATS candidate profile V1...",
  ];

  useEffect(() => {
    let interval;
    if (upload.isPending) {
      setProcessingStep(0);
      interval = setInterval(() => {
        setProcessingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 900);
    } else {
      setProcessingStep(0);
    }
    return () => clearInterval(interval);
  }, [upload.isPending]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: MAX_BYTES,
    multiple: false,
    onDropAccepted: (files) => {
      setErr("");
      setFile(files[0]);
      if (!title) setTitle(files[0].name.replace(/\.pdf$/i, ""));
    },
    onDropRejected: (rejections) => {
      const reason = rejections?.[0]?.errors?.[0]?.message || "Only PDF files up to 5 MB are supported.";
      setErr(reason);
    },
  });

  async function submit() {
    if (!file) return;
    setErr("");
    try {
      const data = await upload.mutateAsync({ file, title });
      setFile(null);
      setTitle("");
      onUploaded?.(data.resume);
    } catch (e) {
      setErr(e.message || "Upload failed. Please ensure the PDF is not password-protected.");
    }
  }

  function reset() {
    setFile(null);
    setTitle("");
    setErr("");
  }

  return (
    <div className="space-y-4">
      {!file && (
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 outline-none overflow-hidden group",
            compact ? "p-6" : "p-10",
            isDragActive
              ? "border-[var(--accent)] bg-[var(--accent-soft)]/60 scale-[1.01] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              : "border-[var(--border)] bg-[var(--surface-2)]/70 hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]/30",
            isDragReject && "border-[var(--danger)] bg-red-500/10"
          )}
        >
          <input {...getInputProps()} />

          {/* Laser scanning beam during drag */}
          {isDragActive && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent animate-scan-line pointer-events-none" />
          )}

          <div className="flex flex-col items-center text-center relative z-10">
            <motion.div
              animate={isDragActive ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "rounded-2xl flex items-center justify-center mb-3.5 transition-colors duration-300 shadow-sm",
                compact ? "h-11 w-11" : "h-16 w-16",
                isDragActive
                  ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30"
                  : "bg-[var(--surface)] text-[var(--accent-strong)] border border-[var(--border)] group-hover:scale-105"
              )}
            >
              <UploadCloud size={compact ? 20 : 26} strokeWidth={2.2} />
            </motion.div>

            <div className={cn("font-display font-bold tracking-tight text-[var(--ink)]", compact ? "text-sm" : "text-base sm:text-lg")}>
              {isDragActive ? "Drop PDF to upload" : "Drop your resume PDF here"}
            </div>
            <p className="text-xs text-[var(--ink-muted)] mt-1.5 max-w-xs">
              Drag & drop or <span className="text-[var(--accent-strong)] font-semibold underline decoration-[var(--accent)]/40 underline-offset-2">browse files</span> &bull; PDF up to 5 MB
            </p>

            <div className="flex items-center gap-3 mt-4 text-[11px] text-[var(--ink-muted)]/80">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-[var(--accent)]" /> 100% Private
              </span>
              <span>&bull;</span>
              <span>ATS-Ready AST Extraction</span>
            </div>
          </div>
        </div>
      )}

      {file && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-strong)] shrink-0 border border-[var(--accent)]/20">
            <FileText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[var(--ink)] truncate">{file.name}</div>
            <div className="text-xs text-[var(--ink-muted)] flex items-center gap-2 mt-0.5">
              <span>{formatBytes(file.size)}</span>
              <span>&bull;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ready to parse</span>
            </div>
          </div>
          <button
            onClick={reset}
            className="h-8 w-8 rounded-full hover:bg-[var(--surface-2)] flex items-center justify-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            disabled={upload.isPending}
            title="Remove file"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {file && (
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5">
              Resume Title <span className="font-normal text-[var(--ink-muted)]">(optional)</span>
            </label>
            <Input
              placeholder="e.g. Bhumi Prasad - Full Stack Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={upload.isPending}
            />
          </div>

          {/* Multi-step loading indicator */}
          {upload.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)]">
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[var(--accent-strong)]" />
                  {steps[processingStep]}
                </span>
                <span className="font-mono text-[var(--accent-strong)]">
                  {Math.round(((processingStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)]"
                  initial={{ width: "20%" }}
                  animate={{ width: `${((processingStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.div>
          )}

          <Button
            onClick={submit}
            variant="accent"
            size="lg"
            disabled={upload.isPending}
            className="w-full shadow-sm font-semibold"
          >
            {upload.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Parsing Resume...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Upload &amp; Analyze ATS
              </>
            )}
          </Button>
        </div>
      )}

      {err && (
        <div className="flex items-start gap-2.5 text-xs text-[var(--danger)] bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="leading-relaxed">{err}</div>
        </div>
      )}
    </div>
  );
}
