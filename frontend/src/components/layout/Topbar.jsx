import { Search, Sun, Moon, ShieldCheck, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import { IconButton } from "@/components/ui/IconButton";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { NotificationsPopover } from "./NotificationsPopover";

const ROUTE_NAMES = {
  "/dashboard": "Dashboard",
  "/resumes": "Resumes",
  "/insights": "Analytics & Insights",
  "/versions": "Version History",
  "/history": "Activity Logs",
  "/settings": "Account Settings",
};

export function Topbar({ onOpenPalette }) {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const currentTitle = ROUTE_NAMES[location.pathname] || (
    location.pathname.startsWith("/resumes/") ? "Resume Details" : "Workspace"
  );

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform);

  return (
    <header className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border)]">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--ink-muted)]">
              Workspace
            </span>
            <span className="text-xs text-[var(--ink-muted)]">/</span>
            <span className="text-xs font-bold text-[var(--ink)]">
              {currentTitle}
            </span>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ATS Engine Online
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenPalette}
          className="hidden md:flex items-center gap-3 h-9 w-[280px] lg:w-[320px] rounded-full bg-[var(--surface)] border border-[var(--border)] pl-3.5 pr-1.5 shadow-sm transition-all hover:border-[var(--accent)]/40 hover:shadow-md text-left"
        >
          <Search size={14} className="text-[var(--ink-muted)] shrink-0" />
          <span className="flex-1 text-xs text-[var(--ink-muted)] truncate">
            Quick search or action...
          </span>
          <kbd className="inline-flex items-center gap-0.5 text-[10px] px-2 h-6 rounded-full bg-[var(--surface-2)] text-[var(--ink-muted)] border border-[var(--border)] font-semibold font-mono">
            {isMac ? "⌘" : "Ctrl"} K
          </kbd>
        </button>

        <IconButton
          onClick={onOpenPalette}
          title="Search"
          className="md:hidden"
        >
          <Search size={15} />
        </IconButton>

        <IconButton onClick={toggle} title="Toggle theme">
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
        </IconButton>

        <NotificationsPopover />

        {user && (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--border)]">
            <div className="h-8 w-8 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] flex items-center justify-center font-bold text-xs border border-[var(--accent)]/30">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-[var(--ink)] leading-none truncate max-w-[110px]">
                {user.name || "Engineer"}
              </div>
              <div className="text-[10px] text-[var(--ink-muted)] leading-none mt-1 truncate max-w-[110px]">
                {user.email || ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
