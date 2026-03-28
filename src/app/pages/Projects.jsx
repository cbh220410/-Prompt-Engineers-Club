import { useEffect, useMemo, useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ExternalLink, Github } from "lucide-react";
import { ScrollReveal } from "../components/ScrollReveal";
import { api } from "../lib/api";
import { useThemeMode } from "../lib/useThemeMode";
const lightStatusConfig = {
  Completed: { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "In Progress": { badge: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
  Planning: { badge: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400" }
};
const darkStatusConfig = {
  Completed: { badge: "bg-emerald-400/15 text-emerald-100 border border-emerald-300/30", dot: "bg-emerald-300" },
  "In Progress": { badge: "bg-blue-400/15 text-blue-100 border border-blue-300/30", dot: "bg-blue-300" },
  Planning: { badge: "bg-amber-400/15 text-amber-100 border border-amber-300/30", dot: "bg-amber-300" }
};
const filters = ["All", "Completed", "In Progress", "Planning"];
function Projects() {
  const isDarkTheme = useThemeMode();
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    api.getProjects().then((data) => {
      if (!mounted) return;
      setProjects(data);
    }).catch((err) => {
      if (!mounted) return;
      setError(err instanceof Error ? err.message : "Failed to load projects");
    }).finally(() => {
      if (!mounted) return;
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const filtered = useMemo(() => {
    return activeFilter === "All" ? projects : projects.filter((p) => p.status === activeFilter);
  }, [activeFilter, projects]);
  const statusConfig = isDarkTheme ? darkStatusConfig : lightStatusConfig;
  return <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {
    /* Filter Bar */
  }
        <ScrollReveal delay={100} className="flex flex-wrap gap-2 justify-center mb-12">
          {filters.map((f) => <button
    key={f}
    onClick={() => setActiveFilter(f)}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === f ? isDarkTheme ? "bg-white text-black shadow-md" : "bg-black text-white shadow-md" : isDarkTheme ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
  >
              {f}
            </button>)}
        </ScrollReveal>

        {
    /* Projects Grid */
  }
        {loading && <p className={`text-center mb-6 ${isDarkTheme ? "text-gray-400" : "text-slate-500"}`}>
            Loading projects...
          </p>}
        {error && <p className="text-center text-red-400 mb-6">{error}</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && !error && filtered.map((project, index) => {
    const s = statusConfig[project.status] ?? {
      badge: isDarkTheme ? "bg-slate-500/15 text-slate-100 border border-slate-300/25" : "bg-gray-50 text-gray-700 border border-gray-200",
      dot: isDarkTheme ? "bg-slate-300" : "bg-gray-400"
    };
    return <ScrollReveal key={project._id} delay={index % 3 * 80}>
                <div className={`group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full hover:-translate-y-1 ${isDarkTheme ? "bg-[linear-gradient(170deg,rgba(2,6,23,0.95),rgba(15,23,42,0.93))] border border-white/10 hover:shadow-[0_26px_68px_-44px_rgba(14,165,233,0.62)]" : "bg-white border border-gray-200 hover:shadow-2xl"}`}>
                  {
      /* Image */
    }
                  <div className={`aspect-video overflow-hidden relative ${isDarkTheme ? "bg-slate-900" : "bg-gray-100"}`}>
                    <ImageWithFallback
      src={project.image}
      alt={project.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkTheme ? "bg-gradient-to-t from-black/35 to-transparent" : "bg-gradient-to-t from-black/20 to-transparent"}`} />
                  </div>

                  {
      /* Content */
    }
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className={`text-lg font-semibold leading-snug flex-1 ${isDarkTheme ? "text-white" : "text-slate-900"}`}>{project.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${s.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {project.status}
                      </span>
                    </div>
                    <p className={`text-sm mb-4 leading-relaxed flex-1 ${isDarkTheme ? "text-slate-300" : "text-gray-500"}`}>{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tags.map((tag, tagIndex) => <span
      key={tagIndex}
      className={`text-xs px-2.5 py-1 rounded-full ${isDarkTheme ? "bg-white/10 text-slate-200 border border-white/10" : "bg-gray-100 text-gray-600"}`}
    >
                          {tag}
                        </span>)}
                    </div>
                    <div className={`flex gap-2 pt-4 border-t ${isDarkTheme ? "border-white/10" : "border-gray-100"}`}>
                      <a href={project.repoUrl || "#"} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors flex-1 justify-center font-medium ${isDarkTheme ? "border border-white/20 text-white hover:bg-white/10" : "border border-gray-200 hover:bg-gray-50"}`}>
                        <Github size={14} />
                        Code
                      </a>
                      <a href={project.link || "#"} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors flex-1 justify-center font-medium ${isDarkTheme ? "bg-white text-black hover:bg-slate-200" : "bg-black text-white hover:bg-gray-800"}`}>
                        <ExternalLink size={14} />
                        Details
                      </a>
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
  Projects
};
