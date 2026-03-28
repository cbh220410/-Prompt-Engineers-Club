import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Users } from "lucide-react";
import { ScrollReveal } from "../components/ScrollReveal";
import { api, Plan } from "../lib/api";
import { useThemeMode } from "../lib/useThemeMode";

const darkEventTypeConfig: Record<string, { badge: string; border: string }> = {
  "Prompt Lab": {
    badge: "bg-violet-400/10 text-violet-100 border border-violet-300/20",
    border: "border-violet-400/70",
  },
  "Build With AI": {
    badge: "bg-blue-400/10 text-blue-100 border border-blue-300/20",
    border: "border-blue-400/70",
  },
  "Expert Session": {
    badge: "bg-emerald-400/10 text-emerald-100 border border-emerald-300/20",
    border: "border-emerald-400/70",
  },
  "AI Competition": {
    badge: "bg-rose-400/10 text-rose-100 border border-rose-300/20",
    border: "border-rose-400/70",
  },
  "Community Session": {
    badge: "bg-amber-400/10 text-amber-100 border border-amber-300/20",
    border: "border-amber-400/70",
  },
  "Prompt Engineering": {
    badge: "bg-violet-400/10 text-violet-100 border border-violet-300/20",
    border: "border-violet-400/70",
  },
  DSA: {
    badge: "bg-cyan-400/10 text-cyan-100 border border-cyan-300/20",
    border: "border-cyan-400/70",
  },
  "Prompt Engineering and DSA": {
    badge: "bg-fuchsia-400/10 text-fuchsia-100 border border-fuchsia-300/20",
    border: "border-fuchsia-400/70",
  },
};

const lightEventTypeConfig: Record<string, { badge: string; border: string }> = {
  "Prompt Lab": {
    badge: "bg-violet-100 text-violet-700 border border-violet-200",
    border: "border-violet-300/80",
  },
  "Build With AI": {
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
    border: "border-blue-300/80",
  },
  "Expert Session": {
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    border: "border-emerald-300/80",
  },
  "AI Competition": {
    badge: "bg-rose-100 text-rose-700 border border-rose-200",
    border: "border-rose-300/80",
  },
  "Community Session": {
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    border: "border-amber-300/80",
  },
  "Prompt Engineering": {
    badge: "bg-violet-100 text-violet-700 border border-violet-200",
    border: "border-violet-300/80",
  },
  DSA: {
    badge: "bg-cyan-100 text-cyan-700 border border-cyan-200",
    border: "border-cyan-300/80",
  },
  "Prompt Engineering and DSA": {
    badge: "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200",
    border: "border-fuchsia-300/80",
  },
};

export function Plans() {
  const isDarkTheme = useThemeMode();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .getPlans()
      .then((data) => {
        if (!mounted) return;
        setPlans(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load plans");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const upcomingEvents = useMemo(
    () => plans.filter((p) => p.category === "upcoming"),
    [plans]
  );
  const recurringSchedule = useMemo(
    () => plans.filter((p) => p.category === "recurring"),
    [plans]
  );
  const eventTypeConfig = isDarkTheme ? darkEventTypeConfig : lightEventTypeConfig;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-7xl mx-auto ${isDarkTheme ? "text-slate-100" : "text-slate-900"}`}>
        <ScrollReveal className={`mb-8 pb-4 border-b ${isDarkTheme ? "border-white/10" : "border-slate-200/90"}`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDarkTheme ? "text-white" : "text-slate-900"}`}>
                Plans
              </h1>
              <p className={`mt-2 text-sm md:text-base ${isDarkTheme ? "text-slate-300" : "text-slate-600"}`}>
                Minimal schedule view aligned with the club theme.
              </p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border ${isDarkTheme ? "border-white/20 bg-white/5 text-slate-200" : "border-slate-300/80 bg-white text-slate-700"}`}
            >
              {upcomingEvents.length} active sessions
            </span>
          </div>
        </ScrollReveal>

        <div className="space-y-10">
          <section>
            <ScrollReveal>
              <h2 className={`text-lg md:text-xl font-semibold ${isDarkTheme ? "text-white" : "text-slate-900"}`}>
                Active Prompt Sessions
              </h2>
            </ScrollReveal>

            {loading && <p className={`mt-4 ${isDarkTheme ? "text-slate-300" : "text-slate-500"}`}>Loading plans...</p>}
            {error && <p className="mt-4 text-red-400">{error}</p>}
            {!loading && !error && upcomingEvents.length === 0 && (
              <p className={`mt-4 text-sm ${isDarkTheme ? "text-slate-300" : "text-slate-500"}`}>
                No upcoming sessions available yet.
              </p>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((event, index) => {
                const cfg = eventTypeConfig[event.type] ?? {
                  badge: isDarkTheme
                    ? "bg-white/5 text-slate-200 border border-white/20"
                    : "bg-slate-100 text-slate-700 border border-slate-200",
                  border: isDarkTheme ? "border-slate-400/60" : "border-slate-300/80",
                };

                return (
                  <ScrollReveal key={event._id || `${event.title}-${index}`} delay={index * 60}>
                    <article
                      className={`group rounded-2xl border p-5 h-full transition-all duration-300 ${isDarkTheme
                        ? "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
                        : "border-slate-200/90 bg-[linear-gradient(165deg,rgba(255,255,255,0.94),rgba(241,245,249,0.96))] hover:-translate-y-0.5 hover:shadow-[0_24px_62px_-42px_rgba(14,165,233,0.35)]"}`}
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2.5">
                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}>
                          {event.type}
                        </span>
                      </div>

                      <h3 className={`text-base md:text-lg font-semibold leading-snug ${isDarkTheme ? "text-white" : "text-slate-900"}`}>
                        {event.title}
                      </h3>

                      <p className={`mt-2 text-sm leading-relaxed ${isDarkTheme ? "text-slate-300" : "text-slate-600"}`}>
                        {event.description}
                      </p>

                      <div className={`mt-3 flex items-center gap-2 text-sm ${isDarkTheme ? "text-slate-300" : "text-slate-600"}`}>
                        <Users size={15} />
                        {(event.attendees ?? 0)} members participating
                      </div>

                      <button
                        className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${isDarkTheme
                          ? `border-l-2 ${cfg.border} border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.1]`
                          : "border border-sky-300/70 bg-sky-100 text-sky-700 hover:bg-sky-200"}`}
                      >
                        Join Plan
                        <ArrowRight size={14} />
                      </button>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>

          <section>
            <ScrollReveal>
              <h2 className={`text-lg md:text-xl font-semibold ${isDarkTheme ? "text-white" : "text-slate-900"}`}>
                Prompt Practice Tracks
              </h2>
            </ScrollReveal>

            {!loading && !error && recurringSchedule.length === 0 && (
              <p className={`mt-4 text-sm ${isDarkTheme ? "text-slate-300" : "text-slate-500"}`}>
                Recurring tracks will appear here once added from admin.
              </p>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recurringSchedule.map((item, index) => (
                <ScrollReveal key={item._id || `${item.title}-${index}`} delay={index * 70}>
                  <article
                    className={`group rounded-2xl border p-5 h-full transition-all duration-300 ${isDarkTheme
                      ? "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-sky-300/40 hover:bg-white/[0.05]"
                      : "border-slate-200/90 bg-[linear-gradient(165deg,rgba(255,255,255,0.94),rgba(241,245,249,0.96))] hover:-translate-y-0.5 hover:shadow-[0_24px_62px_-42px_rgba(14,165,233,0.35)]"}`}
                  >
                    <p className={`text-[11px] uppercase tracking-[0.1em] ${isDarkTheme ? "text-slate-400" : "text-slate-500"}`}>
                      {item.type || "Practice Track"}
                    </p>
                    <h3 className={`mt-2 text-base font-semibold leading-snug ${isDarkTheme ? "text-white" : "text-slate-900"}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-2 text-sm leading-relaxed ${isDarkTheme ? "text-slate-300" : "text-slate-600"}`}>
                      {item.description}
                    </p>
                    <button
                      className={`mt-4 text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${isDarkTheme
                        ? "text-sky-200 hover:text-white"
                        : "text-sky-700 hover:text-sky-800"}`}
                    >
                      Join Track
                      <ArrowRight size={14} />
                    </button>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </div>

        <ScrollReveal delay={120}>
          <div className={`mt-8 pt-4 border-t ${isDarkTheme ? "border-white/10" : "border-slate-200/90"}`}>
            <p className={`text-sm ${isDarkTheme ? "text-slate-300" : "text-violet-700"}`}>
              <strong>Note:</strong> Session tracks evolve continuously as we
              explore new AI systems, prompt frameworks, and innovation strategies.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
