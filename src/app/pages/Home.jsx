import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Users, Lightbulb, Calendar, Instagram } from "lucide-react";
import { ScrollReveal } from "../components/ScrollReveal";
import DotGrid from "../components/DotGrid";
import VariableProximity from "../components/VariableProximity";
import Squares from "../components/Squares";
import { api } from "../lib/api";
import discordIcon from "../../assets/images/social/discord.jpeg";
import linkedinIcon from "../../assets/images/social/linkedin.png";
import telegramIcon from "../../assets/images/social/telegram.png";
import whatsappIcon from "../../assets/images/social/whatsapp.webp";
const iconMap = {
  Users,
  Lightbulb,
  Calendar
};
const defaultFeaturePlans = [
  {
    icon: "Users",
    title: "Prompt Battle Arena",
    desc: "Concept: Members compete to write the best prompts.\nHow it works: Given a task, compare outputs across tools and judge creativity, accuracy, and prompt efficiency.\nBonus: Leaderboard and weekly winners.",
    link: "/plans",
    cta: "Enter Arena"
  },
  {
    icon: "Lightbulb",
    title: "AI Project Lab",
    desc: "Concept: Build real projects using prompts plus coding.\nActivities: chatbot API app, resume generator, AI fitness planner, image generator.\nStructure: Week 1 idea, Week 2 prompt design, Week 3 build, Week 4 demo.",
    link: "/projects",
    cta: "Start Building"
  },
  {
    icon: "Calendar",
    title: "Prompt-to-Product Series",
    desc: "Concept: Convert prompts into usable tools.\nExamples: blog generator, website content generator, business plan creator.\nOutcome: Learn monetization and freelancing opportunities.",
    link: "/projects",
    cta: "See Product Ideas"
  },
  {
    icon: "Lightbulb",
    title: "Reverse Prompt Engineering",
    desc: "Concept: Guess the prompt from AI output.\nHow it works: View output, infer the prompt, then compare with the best version.\nOutcome: Deeper reasoning and stronger prompt design skills.",
    link: "/plans",
    cta: "Try Challenge"
  },
  {
    icon: "Calendar",
    title: "AI Tools Exploration Day",
    desc: "Format: Weekly or bi-weekly deep dives.\nTools: ChatGPT, Midjourney, Notion AI, GitHub Copilot.\nMembers present features, use cases, and limitations.",
    link: "/plans",
    cta: "View Sessions"
  },
  {
    icon: "Users",
    title: "Mini Hackathons (Monthly)",
    desc: "Duration: 4 to 6 hours.\nThemes: AI for students, healthcare, fitness, and villages.\nOutput: Working prototype plus pitch.",
    link: "/projects",
    cta: "Build Prototype"
  }
];
const dockItems = [
  {
    label: "Discord",
    icon: discordIcon,
    href: "https://discord.gg/fMycgcFf",
    bg: "bg-indigo-500/90"
  },
  {
    label: "Telegram",
    icon: telegramIcon,
    href: "https://t.me/+aVnZxBpqjyQ1NWQ1",
    bg: "bg-sky-500/90"
  },
  {
    label: "WhatsApp",
    icon: whatsappIcon,
    href: "https://chat.whatsapp.com/Hfc1Bynd3vrBLvXpUNHS0x",
    bg: "bg-emerald-500/90"
  },
  {
    label: "LinkedIn",
    icon: linkedinIcon,
    href: "https://www.linkedin.com/company/prompt-engineering-club",
    bg: "bg-blue-600/90"
  },
  {
    label: "Instagram",
    iconComponent: Instagram,
    href: "https://www.instagram.com/promptengineers_club/?__pwa=1",
    bg: "bg-gradient-to-br from-fuchsia-500 to-orange-400"
  }
];
function Home() {
  const heroRef = useRef(null);
  const [content, setContent] = useState({
    heroBadge: "",
    heroDescription: "",
    stats: [],
    features: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publicCounts, setPublicCounts] = useState({ members: 0, projects: 0, plans: 0 });
  const [hoveredDockIndex, setHoveredDockIndex] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : true
  );
  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      api.getHomeContent(),
      api.getTeam(),
      api.getProjects(),
      api.getPlans()
    ]).then(([homeRes, teamRes, projectRes, planRes]) => {
      if (!mounted) return;
      if (homeRes.status === "fulfilled") {
        setContent(homeRes.value);
      } else {
        setError(homeRes.reason instanceof Error ? homeRes.reason.message : "Failed to load content");
      }
      setPublicCounts({
        members: teamRes.status === "fulfilled" ? teamRes.value.length : 0,
        projects: projectRes.status === "fulfilled" ? projectRes.value.length : 0,
        plans: planRes.status === "fulfilled" ? planRes.value.length : 0
      });
    }).finally(() => {
      if (!mounted) return;
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => {
      setIsDarkTheme(root.classList.contains("dark"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const features = useMemo(
    () => content.features && content.features.length > 0 ? content.features : defaultFeaturePlans,
    [content.features]
  );
  const stats = useMemo(() => content.stats || [], [content.stats]);
  const displayStats = useMemo(() => {
    if (stats.length > 0) return stats;
    return [
      { value: String(publicCounts.members), label: "Members Listed" },
      { value: String(publicCounts.projects), label: "Projects Listed" },
      { value: String(publicCounts.plans), label: "Plans Listed" }
    ];
  }, [stats, publicCounts]);
  return <div className="relative">
      <aside className="fixed left-4 top-1/2 z-40 -translate-y-1/2 hidden md:flex pointer-events-none">
        <div
    className={`pointer-events-auto rounded-2xl border backdrop-blur-xl px-2 py-3 ${isDarkTheme ? "border-white/20 bg-black/35 shadow-[0_30px_55px_-35px_rgba(0,0,0,0.9)]" : "border-slate-300/70 bg-white/80 shadow-[0_22px_40px_-30px_rgba(30,41,59,0.5)]"}`}
    onMouseLeave={() => setHoveredDockIndex(null)}
  >
          <div className="flex flex-col items-center gap-2">
            {dockItems.map((item, idx) => {
    const distance = hoveredDockIndex === null ? 99 : Math.abs(hoveredDockIndex - idx);
    const scale = hoveredDockIndex === null ? 1 : distance === 0 ? 1.75 : distance === 1 ? 1.35 : distance === 2 ? 1.12 : 1;
    const translateY = hoveredDockIndex === null ? 0 : distance === 0 ? -10 : distance === 1 ? -5 : 0;
    const isActive = hoveredDockIndex === idx;
    return <a
      key={item.label}
      href={item.href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHoveredDockIndex(idx)}
      className="group relative"
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        transition: "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)"
      }}
    >
                  <span className="sr-only">{item.label}</span>
                  <span className={`absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium transition-all duration-150 ${isDarkTheme ? "text-white bg-black/80" : "text-slate-700 bg-white/95 border border-slate-200/80"} ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 pointer-events-none"}`}>
                    {item.label}
                  </span>
                  <span className={`w-12 h-12 rounded-2xl ${item.bg} border border-white/30 overflow-hidden flex items-center justify-center shadow-[0_16px_28px_-20px_rgba(0,0,0,0.8)]`}>
                    {item.iconComponent ? <item.iconComponent className="text-white" size={22} /> : <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />}
                  </span>
                </a>;
  })}
          </div>
        </div>
      </aside>

      <aside className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 md:hidden pointer-events-none">
        <div
    className={`pointer-events-auto rounded-2xl border backdrop-blur-xl px-3 py-2 ${isDarkTheme ? "border-white/20 bg-black/35 shadow-[0_24px_45px_-35px_rgba(0,0,0,0.95)]" : "border-slate-300/70 bg-white/80 shadow-[0_20px_34px_-26px_rgba(30,41,59,0.5)]"}`}
    onMouseLeave={() => setHoveredDockIndex(null)}
  >
          <div className="flex items-center gap-2">
            {dockItems.map((item, idx) => {
    const distance = hoveredDockIndex === null ? 99 : Math.abs(hoveredDockIndex - idx);
    const scale = hoveredDockIndex === null ? 1 : distance === 0 ? 1.35 : distance === 1 ? 1.15 : 1;
    return <a
      key={`mobile-${item.label}`}
      href={item.href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHoveredDockIndex(idx)}
      className="block"
      style={{
        transform: `scale(${scale})`,
        transition: "transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)"
      }}
    >
                  <span className="sr-only">{item.label}</span>
                  <span className={`w-10 h-10 rounded-xl ${item.bg} border border-white/30 overflow-hidden flex items-center justify-center`}>
                    {item.iconComponent ? <item.iconComponent className="text-white" size={18} /> : <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />}
                  </span>
                </a>;
  })}
          </div>
        </div>
      </aside>

      {
    /* Full-page interactive dot-grid background (fixed so it covers the whole page while scrolling) */
  }
      <div className="fixed inset-0 z-0">
        {isDarkTheme ? <DotGrid
    dotSize={5}
    gap={15}
    baseColor="#2a1f4a"
    activeColor="#7c3aed"
    proximity={120}
    shockRadius={250}
    shockStrength={5}
    resistance={750}
    returnDuration={1.5}
  /> : <Squares
    speed={0.5}
    squareSize={40}
    direction="diagonal"
    borderColor="#cbd5e1"
    hoverFillColor="#e2e8f0"
  />}
      </div>

      {
    /* Hero Section */
  }
      <section ref={heroRef} className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
        <div className="relative max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <span className={`inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-1.5 mb-7 ${isDarkTheme ? "bg-white/10 border border-white/20 text-gray-300" : "bg-white/85 border border-slate-300/80 text-slate-700 shadow-sm"}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {content.heroBadge || "Applications Open"}
            </span>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.08]">
              <VariableProximity
    label="Prompt Engineers  Club"
    fromFontVariationSettings="'wght' 700, 'opsz' 9"
    toFontVariationSettings="'wght' 1000, 'opsz' 40"
    containerRef={heroRef}
    radius={150}
    falloff="linear"
  />
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className={`text-xl mb-10 max-w-xl mx-auto leading-relaxed ${isDarkTheme ? "text-gray-400" : "text-slate-600"}`}>
              {content.heroDescription || "Empowering engineering students through innovation, collaboration, and continuous learning."}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
    to="/projects"
    className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3.5 rounded-xl hover:bg-gray-200 active:scale-95 transition-all font-medium shadow-lg shadow-white/10"
  >
                View Our Projects
                <ArrowRight size={18} />
              </Link>
              <Link
    to="/contact"
    className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl active:scale-95 transition-all font-medium ${isDarkTheme ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-white border border-slate-300/80 text-slate-900 hover:bg-slate-100"}`}
  >
                Join the Club
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {
    /* Stats Bar */
  }
      <section className={`relative z-10 py-10 px-4 border-y backdrop-blur-md ${isDarkTheme ? "border-white/10 bg-black/60" : "border-slate-200/90 bg-white/70"}`}>
        {loading && <p className={`text-center mb-4 ${isDarkTheme ? "text-gray-400" : "text-slate-500"}`}>Loading homepage content...</p>}
        {error && <p className="text-center text-red-400 mb-4">{error}</p>}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {!loading && !error && displayStats.map((s, i) => <ScrollReveal key={i} delay={i * 70}>
              <div>
                <div className="text-3xl font-extrabold mb-0.5">{s.value}</div>
                <div className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-slate-600"}`}>{s.label}</div>
              </div>
            </ScrollReveal>)}
        </div>
      </section>

      {
    /* Features */
  }
      <section className={`relative z-10 py-24 px-4 sm:px-6 lg:px-8 backdrop-blur-md ${isDarkTheme ? "bg-black/50" : "bg-white/55"}`}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Future Plans</h2>
            <p className={`max-w-lg mx-auto ${isDarkTheme ? "text-gray-400" : "text-slate-600"}`}>
              Building the next generation of engineers through hands-on, real-world experience.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {!loading && !error && features.map(({ icon, title, desc, link, cta }, i) => {
    const Icon = icon && icon in iconMap ? iconMap[icon] : Lightbulb;
    return <ScrollReveal key={i} delay={i * 100}>
                <div className={`group p-8 rounded-2xl border transition-all duration-300 h-full flex flex-col ${isDarkTheme ? "bg-white/5 border-white/10 hover:border-white/25 hover:shadow-2xl hover:shadow-black/50" : "bg-white/80 border-slate-200/90 hover:border-slate-300 hover:shadow-[0_20px_46px_-30px_rgba(30,41,59,0.45)]"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${isDarkTheme ? "bg-white" : "bg-slate-900"}`}>
                    <Icon className={isDarkTheme ? "text-black" : "text-white"} size={22} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkTheme ? "text-white" : "text-slate-900"}`}>{title}</h3>
                  <p className={`mb-5 flex-1 leading-relaxed whitespace-pre-line ${isDarkTheme ? "text-gray-400" : "text-slate-600"}`}>{desc}</p>
                  <Link
      to={link}
      className={`font-medium inline-flex items-center gap-1.5 hover:gap-3 transition-all duration-200 ${isDarkTheme ? "text-white" : "text-slate-900"}`}
    >
                    {cta || "Learn more"} <ArrowRight size={14} />
                  </Link>
                </div>
              </ScrollReveal>;
  })}
            {!loading && !error && features.length === 0 && <p className={`md:col-span-3 text-center text-sm ${isDarkTheme ? "text-gray-400" : "text-slate-500"}`}>No feature cards have been published yet.</p>}
          </div>
        </div>
      </section>

      {
    /* CTA Section */
  }
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
        <ScrollReveal>
          <div className={`max-w-4xl mx-auto text-center rounded-3xl px-8 py-16 relative overflow-hidden ${isDarkTheme ? "bg-black/90" : "bg-white/85 border border-slate-200/90 shadow-[0_24px_58px_-36px_rgba(30,41,59,0.4)]"}`}>
            <div className="relative">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkTheme ? "text-white" : "text-slate-900"}`}>
                Ready to Join Us?
              </h2>
              <p className={`mb-8 text-lg max-w-xl mx-auto leading-relaxed ${isDarkTheme ? "text-gray-400" : "text-slate-600"}`}>
                Connect with like-minded engineering enthusiasts and be part of something extraordinary.
              </p>
              <Link
    to="/contact"
    className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all font-medium"
  >
                Get in Touch
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>;
}
export {
  Home
};
