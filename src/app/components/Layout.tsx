import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Github, Instagram, Linkedin, Moon, Sun } from "lucide-react";
import PillNav from "./PillNav";
import navLogo from "../../assets/images/logo.png";
import footerLogo from "../../assets/images/logonobg-optimized.png";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "Team", href: "/team" },
  { label: "Projects", href: "/projects" },
  { label: "Plans", href: "/plans" },
  { label: "Contact", href: "/contact" },
];

const footerLinks = [
  { to: "/team", label: "Team" },
  { to: "/projects", label: "Projects" },
  { to: "/plans", label: "Plans & Events" },
  { to: "/contact", label: "Contact" },
];

export function Layout() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = window.localStorage.getItem("theme");
    return savedTheme === "light" ? "light" : "dark";
  });
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkTheme);
    root.classList.toggle("light", !isDarkTheme);
    window.localStorage.setItem("theme", theme);
  }, [isDarkTheme, theme]);

  return (
    <div
      className={`atmo-shell min-h-screen ${isDarkTheme
        ? "bg-[radial-gradient(900px_420px_at_4%_-5%,rgba(37,99,235,0.16),transparent_52%),radial-gradient(980px_480px_at_110%_112%,rgba(99,102,241,0.16),transparent_52%)]"
        : "bg-[radial-gradient(900px_420px_at_4%_-5%,rgba(59,130,246,0.18),transparent_52%),radial-gradient(980px_480px_at_110%_112%,rgba(14,165,233,0.14),transparent_52%)]"}`}
    >
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <img
            src={navLogo}
            alt="Prompt Engineers  Club"
            className="h-20 md:h-[5.5rem] w-auto object-contain"
          />
          <PillNav
            items={baseNavItems}
            activeHref={pathname}
            themeMode={theme}
            baseColor={isDarkTheme ? "#111111" : "#0f172a"}
            pillColor={isDarkTheme ? "#ffffff" : "#f8fafc"}
            pillTextColor={isDarkTheme ? "#111111" : "#0f172a"}
            hoveredPillTextColor="#ffffff"
            ease="power2.out"
            initialLoadAnimation={false}
          />
          <button
            type="button"
            onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold backdrop-blur-md transition-all ${isDarkTheme ? "border-white/20 bg-slate-900/75 text-white hover:bg-slate-800/80" : "border-slate-300/90 bg-white/85 text-slate-700 hover:bg-white"}`}
            aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
            title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDarkTheme ? <Sun size={14} /> : <Moon size={14} />}
            <span className="hidden sm:inline">{isDarkTheme ? "Dark" : "Light"}</span>
          </button>
        </div>
      </div>

      <main className={isHomePage ? "pt-28 md:pt-32 pb-24 md:pb-0" : "pt-28 md:pt-32"}>
        <Outlet />
      </main>

      <footer className={`relative z-10 mt-20 px-3 sm:px-4 md:px-6 ${isDarkTheme ? "text-gray-300" : "text-slate-700"} ${isHomePage ? "pb-24 md:pb-12" : "pb-12"}`}>
          <div className={`max-w-7xl mx-auto rounded-3xl border px-4 sm:px-6 lg:px-8 py-12 ${isDarkTheme ? "border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(3,7,18,0.96))] shadow-[0_28px_70px_-45px_rgba(15,23,42,0.95)]" : "border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,245,249,0.98))] shadow-[0_24px_60px_-42px_rgba(30,41,59,0.35)]"}`}>
            <div className="grid md:grid-cols-3 gap-10 mb-10">
              <div>
                <Link to="/" className="flex items-center gap-2.5 mb-4">
                  <img src={footerLogo} alt="Prompt Engineering" className="w-8 h-8 rounded-lg object-contain" />
                  <span className={`font-semibold text-sm ${isDarkTheme ? "text-white" : "text-slate-900"}`}>Prompt Engineers  Club</span>
                </Link>
                <p className={`text-sm leading-relaxed max-w-xs ${isDarkTheme ? "text-gray-400" : "text-slate-600"}`}>
                  Empowering engineering students through innovation, collaboration, and continuous learning.
                </p>
              </div>

              <div>
                <h4 className={`font-semibold text-sm mb-4 ${isDarkTheme ? "text-white" : "text-slate-900"}`}>Navigation</h4>
                <ul className="space-y-2.5">
                  {footerLinks.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className={`text-sm transition-all duration-150 hover:translate-x-0.5 inline-flex ${isDarkTheme ? "hover:text-white" : "text-slate-700 hover:text-slate-900"}`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className={`font-semibold text-sm mb-4 ${isDarkTheme ? "text-white" : "text-slate-900"}`}>Follow Us</h4>
                <div className="flex gap-3">
                  <a href="#" className={`p-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${isDarkTheme ? "border-white/10 bg-gray-800/70 hover:bg-gray-700" : "border-slate-300/80 bg-white/85 hover:bg-slate-100"}`}>
                    <Github size={16} />
                  </a>
                  <a
                    href="https://www.instagram.com/promptengineers_club/?__pwa=1"
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${isDarkTheme ? "border-white/10 bg-gray-800/70 hover:bg-gray-700" : "border-slate-300/80 bg-white/85 hover:bg-slate-100"}`}
                  >
                    <Instagram size={16} />
                  </a>
                  <a href="#" className={`p-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${isDarkTheme ? "border-white/10 bg-gray-800/70 hover:bg-gray-700" : "border-slate-300/80 bg-white/85 hover:bg-slate-100"}`}>
                    <Linkedin size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className={`border-t pt-6 text-center ${isDarkTheme ? "border-gray-800/80" : "border-slate-200/90"}`}>
              <p className={`text-xs ${isDarkTheme ? "text-gray-600" : "text-slate-500"}`}>&copy; 2026 Prompt Engineers  Club. All rights reserved.</p>
            </div>
          </div>
      </footer>
    </div>
  );
}
