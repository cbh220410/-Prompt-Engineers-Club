import { useEffect, useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Linkedin, Github, Mail } from "lucide-react";
import { ScrollReveal } from "../components/ScrollReveal";
import { api } from "../lib/api";
import { useThemeMode } from "../lib/useThemeMode";
function Team() {
  const isDarkTheme = useThemeMode();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    api.getTeam().then((data) => {
      if (!mounted) return;
      setTeamMembers(data);
    }).catch((err) => {
      if (!mounted) return;
      setError(err instanceof Error ? err.message : "Failed to load team");
    }).finally(() => {
      if (!mounted) return;
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {
    /* Team Grid */
  }
        {loading && <p className={`text-center mb-6 ${isDarkTheme ? "text-gray-400" : "text-slate-500"}`}>
            Loading team members...
          </p>}
        {error && <p className="text-center text-red-400 mb-6">{error}</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && !error && teamMembers.map((member, index) => {
    const links = [
      {
        label: "LinkedIn",
        href: member.linkedin || "",
        icon: Linkedin
      },
      {
        label: "GitHub",
        href: member.github || "",
        icon: Github
      },
      {
        label: "Email",
        href: member.email ? `mailto:${member.email}` : "",
        icon: Mail
      }
    ];
    return <ScrollReveal key={member._id} delay={index % 3 * 80}>
              <div className={`group relative rounded-3xl p-[1px] transition-all duration-500 hover:-translate-y-2 ${isDarkTheme ? "bg-[linear-gradient(145deg,rgba(148,163,184,0.45),rgba(15,23,42,0.1)_40%,rgba(56,189,248,0.32))] shadow-[0_22px_65px_-40px_rgba(14,116,144,0.75)] hover:shadow-[0_32px_90px_-38px_rgba(14,165,233,0.68)]" : "bg-[linear-gradient(145deg,rgba(148,163,184,0.5),rgba(255,255,255,0.95)_45%,rgba(59,130,246,0.38))] shadow-[0_22px_56px_-38px_rgba(30,41,59,0.35)] hover:shadow-[0_32px_76px_-42px_rgba(59,130,246,0.38)]"}`}>
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(90%_75%_at_50%_100%,rgba(56,189,248,0.25),transparent_70%)]" />

                <div className={`relative rounded-[calc(1.5rem-1px)] overflow-hidden backdrop-blur-xl border ${isDarkTheme ? "bg-[linear-gradient(170deg,rgba(2,6,23,0.95),rgba(15,23,42,0.93))] border-white/10" : "bg-[linear-gradient(170deg,rgba(255,255,255,0.96),rgba(248,250,252,0.95))] border-slate-200/90"}`}>
                {
      /* Image with social overlay */
    }
                <div className={`aspect-square overflow-hidden relative ${isDarkTheme ? "bg-slate-900" : "bg-slate-100"}`}>
                  <ImageWithFallback
      src={member.image}
      alt={member.name}
      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-[0.6deg] transition-transform duration-700"
    />
                  <div className={`absolute inset-0 ${isDarkTheme ? "bg-[linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.78))]" : "bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(241,245,249,0.72))]"}`} />

                  <div className={`absolute bottom-3 left-3 right-3 rounded-xl border backdrop-blur-md px-3 py-2 ${isDarkTheme ? "border-white/15 bg-black/30" : "border-slate-300/80 bg-white/80"}`}>
                    <h3 className={`text-lg font-semibold leading-tight ${isDarkTheme ? "text-white" : "text-slate-900"}`}>{member.name}</h3>
                    <span className={`inline-flex mt-1 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full border ${isDarkTheme ? "border-cyan-300/35 bg-cyan-400/10 text-cyan-100" : "border-sky-300/70 bg-sky-100 text-sky-700"}`}>
                      {member.role}
                    </span>
                  </div>

                  {
      /* Hover overlay with social icons */
    }
                  <div className={`absolute inset-0 backdrop-blur-[3px] flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isDarkTheme ? "bg-black/45" : "bg-white/45"}`}>
                    {links.map((item) => {
      const Icon = item.icon;
      const enabled = Boolean(item.href);
      return <a
        key={`${member._id}-${item.label}`}
        href={enabled ? item.href : void 0}
        target={enabled ? "_blank" : void 0}
        rel={enabled ? "noreferrer" : void 0}
        aria-label={item.label}
        className={`p-3 rounded-full border transition-all duration-200 ${enabled ? isDarkTheme ? "bg-white/15 border-white/35 hover:bg-cyan-300/20 hover:border-cyan-200/70 hover:-translate-y-0.5" : "bg-white/85 border-slate-300/70 hover:bg-sky-100 hover:border-sky-300/80 hover:-translate-y-0.5" : isDarkTheme ? "bg-white/5 border-white/10 opacity-40 cursor-not-allowed" : "bg-white/45 border-slate-300/60 opacity-40 cursor-not-allowed"}`}
      >
                          <Icon size={18} className={isDarkTheme ? "text-white" : "text-slate-700"} />
                        </a>;
    })}
                  </div>
                </div>

                {
      /* Info */
    }
                <div className="p-5">
                  <p className={`text-sm leading-relaxed min-h-[3.75rem] ${isDarkTheme ? "text-slate-200/90" : "text-slate-600"}`}>
                    {member.bio || "Club member profile will be updated soon."}
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>;
  })}
        </div>
      </div>
    </div>;
}
export {
  Team
};
