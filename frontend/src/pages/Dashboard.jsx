import { useNavigate } from "react-router-dom";
import {
  Gauge,
  Layers,
  Lightbulb,
  KeyRound,
  UploadCloud,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ScoreEvolutionChart } from "@/components/dashboard/ScoreEvolutionChart";
import { AtsGauge } from "@/components/dashboard/AtsGauge";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { VersionStack } from "@/components/dashboard/VersionStack";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { KeepSharpCard } from "@/components/dashboard/KeepSharpCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import { UploadDropzone } from "@/components/resume/UploadDropzone";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={Gauge}
        title="Couldn't load your dashboard"
        description={error.message}
      />
    );
  }

  const { totals, latestResume, scoreSeries, versionStack, kpi, activity } =
    data || {};

  if (!totals?.resumes) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-6 pb-12">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] text-xs font-semibold">
            <Sparkles size={13} />
            Instant ATS & Gemini 2.5 Analysis
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
            Welcome, {user?.name?.split(" ")[0] || "Engineer"}
          </h1>
          <p className="text-sm text-[var(--ink-muted)] max-w-md mx-auto">
            Upload your resume PDF to unlock your ATS readiness score, identify missing keywords, and get surgical AI rewrites.
          </p>
        </div>
        <Card className="p-6 shadow-card">
          <UploadDropzone onUploaded={(resume) => nav(`/resumes/${resume._id}`)} />
        </Card>
      </div>
    );
  }

  const profileStats = [
    { label: "Resumes", value: totals.resumes },
    { label: "Rewrites", value: totals.rewrites },
    { label: "Analyses", value: totals.analyses },
  ];

  const current = kpi?.atsScore?.value;
  const first = scoreSeries?.[0]?.score;
  const evolutionDelta = current != null && first != null ? current - first : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Personalized Welcome Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-strong)] bg-[var(--accent-soft)] px-2.5 py-0.5 rounded-full">
              Overview
            </span>
            <span className="text-xs text-[var(--ink-muted)]">
              {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-1.5">
            Welcome back, {user?.name?.split(" ")[0] || "Engineer"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1">
            {latestResume
              ? `Active: "${latestResume.title}" (Version V${latestResume.latestVersionNumber || 1})`
              : "Track your ATS score evolution and optimize resume versions."}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => nav("/insights")}
            className="hidden sm:inline-flex"
          >
            <Lightbulb size={14} className="text-amber-500" />
            Insights
          </Button>
          <Button
            variant="accent"
            size="md"
            onClick={() => nav("/resumes")}
            className="shadow-sm"
          >
            <UploadCloud size={15} />
            Upload Resume
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="ATS Score"
          value={kpi?.atsScore?.value ?? "—"}
          suffix={kpi?.atsScore?.value != null ? "/ 100" : null}
          delta={kpi?.atsScore?.delta}
          chart="bars"
          data={kpi?.atsScore?.spark || []}
          icon={Gauge}
        />
        <StatCard
          label="Versions"
          value={kpi?.versions?.value ?? totals.resumes}
          chart="line"
          data={kpi?.versions?.spark || []}
          icon={Layers}
        />
        <StatCard
          label="Issues Identified"
          value={kpi?.issuesIdentified?.value ?? "—"}
          delta={kpi?.issuesIdentified?.delta}
          chart="line"
          data={kpi?.issuesIdentified?.spark || []}
          icon={Lightbulb}
        />
        <StatCard
          label="Keywords Matched"
          value={kpi?.keywordsMatched?.value ?? "—"}
          suffix={
            kpi?.keywordsMatched?.total
              ? `/ ${kpi.keywordsMatched.total}`
              : null
          }
          delta={kpi?.keywordsMatched?.delta}
          chart="line"
          data={kpi?.keywordsMatched?.spark || []}
          icon={KeyRound}
          accent
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          {scoreSeries?.length ? (
            <ScoreEvolutionChart
              data={scoreSeries}
              currentScore={current}
              delta={evolutionDelta}
            />
          ) : (
            <NoAnalysisCard
              onAction={() =>
                latestResume?._id && nav(`/resumes/${latestResume._id}`)
              }
            />
          )}
        </div>
        <div className="lg:col-span-3">
          {current != null ? (
            <AtsGauge score={current} delta={kpi?.atsScore?.delta ?? 0} />
          ) : (
            <Card className="h-full flex items-center justify-center text-center">
              <div className="font-display text-sm font-semibold mb-1">
                No score yet
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Run analysis to populate
              </div>
            </Card>
          )}
        </div>
        <div className="lg:col-span-3">
          <ProfileCard user={user} stats={profileStats} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          {versionStack?.length ? (
            <VersionStack
              versions={versionStack}
              resumeId={latestResume?._id}
              resumeTitle={latestResume?.title}
            />
          ) : (
            <Card className="h-full flex items-center justify-center text-center min-h-[200px]">
              <div className="font-display text-sm font-semibold mb-1">
                No versions yet
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Versions appear after you analyze and rewrite
              </div>
            </Card>
          )}
        </div>
        <div className="lg:col-span-5">
          {activity?.length ? (
            <ActivityFeed items={activity} />
          ) : (
            <Card className="h-full flex items-center justify-center text-center min-h-[200px]">
              <div className="font-display text-sm font-semibold mb-1">
                Quiet here
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Your activity feed lights up after you analyze
              </div>
            </Card>
          )}
        </div>
        {/* <div className="lg:col-span-2">
          <KeepSharpCard />
        </div> */}
      </div>
    </div>
  );
}

function NoAnalysisCard({ onAction }) {
  return (
    <Card className="h-full flex flex-col items-center justify-center text-center min-h-[300px]">
      <div className="h-14 w-14 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)] flex items-center justify-center mb-3">
        <Sparkles size={22} />
      </div>
      <div className="font-display text-base font-semibold tracking-tight">
        Ready when you are
      </div>
      <p className="text-sm text-[var(--ink-muted)] mt-1 max-w-sm">
        You've uploaded a resume — run analysis to see your ATS score, fixable
        issues, and rewrite suggestions.
      </p>
      {onAction && (
        <Button variant="accent" size="md" className="mt-4" onClick={onAction}>
          <Sparkles size={14} /> Analyze now
        </Button>
      )}
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[130px] rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Skeleton className="lg:col-span-7 h-[300px] rounded-3xl" />
        <Skeleton className="lg:col-span-3 h-[300px] rounded-3xl" />
        <Skeleton className="lg:col-span-2 h-[300px] rounded-3xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Skeleton className="lg:col-span-7 h-[260px] rounded-3xl" />
        <Skeleton className="lg:col-span-3 h-[260px] rounded-3xl" />
        <Skeleton className="lg:col-span-2 h-[260px] rounded-3xl" />
      </div>
    </div>
  );
}
