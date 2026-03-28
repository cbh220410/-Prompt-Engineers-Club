import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
const PillNav = ({
  items,
  activeHref,
  className = "",
  themeMode = "dark",
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const shellBackground = themeMode === "dark" ? "linear-gradient(180deg, rgba(2,6,23,0.95), rgba(15,23,42,0.95))" : "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(241,245,249,0.95))";
  const shellBorderClass = themeMode === "dark" ? "border-white/15 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.95)]" : "border-slate-300/70 shadow-[0_14px_30px_-20px_rgba(30,41,59,0.35)]";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = (w * w / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - w * w / 4))) + 1;
        const originY = D - delta;
        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;
        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });
        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");
        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });
        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;
        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);
        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        }
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        }
        tlRefs.current[index] = tl;
      });
    };
    layout();
    window.addEventListener("resize", layout);
    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {
      });
    }
    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1, y: 0 });
    }
    if (initialLoadAnimation) {
      const navItems = navItemsRef.current;
      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, { width: "auto", duration: 0.6, ease });
      }
    }
    return () => window.removeEventListener("resize", layout);
  }, [items, ease, initialLoadAnimation]);
  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto"
    });
  };
  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto"
    });
  };
  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;
    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }
    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: "top center" }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: "top center",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          }
        });
      }
    }
    onMobileMenuClick?.();
  };
  const isExternalLink = (href) => href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#");
  const isRouterLink = (href) => href && !isExternalLink(href);
  const cssVars = {
    ["--base"]: baseColor,
    ["--pill-bg"]: pillColor,
    ["--hover-text"]: hoveredPillTextColor,
    ["--pill-text"]: resolvedPillTextColor,
    ["--nav-h"]: "42px",
    ["--logo"]: "36px",
    ["--pill-pad-x"]: "18px",
    ["--pill-gap"]: "3px"
  };
  return <div className="relative w-auto">
      <nav
    className={`w-auto md:w-max flex items-center justify-start box-border px-0 ${className}`}
    aria-label="Primary"
    style={cssVars}
  >
        <div
    ref={navItemsRef}
    className={`relative items-center rounded-full hidden md:flex border ${shellBorderClass}`}
    style={{ height: "var(--nav-h)", background: shellBackground }}
  >
          <ul
    role="menubar"
    className="list-none flex items-stretch m-0 p-[3px] h-full"
    style={{ gap: "var(--pill-gap)" }}
  >
            {items.map((item, i) => {
    const isActive = activeHref === item.href;
    const pillStyle = {
      background: "var(--pill-bg, #fff)",
      color: "var(--pill-text, var(--base, #000))",
      paddingLeft: "var(--pill-pad-x)",
      paddingRight: "var(--pill-pad-x)"
    };
    const PillContent = <>
                  <span
      className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
      style={{ background: "var(--base, #000)", willChange: "transform" }}
      aria-hidden="true"
      ref={(el) => {
        circleRefs.current[i] = el;
      }}
    />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span className="pill-label relative z-[2] inline-block leading-[1]" style={{ willChange: "transform" }}>
                      {item.label}
                    </span>
                    <span
      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
      style={{ color: "var(--hover-text, #fff)", willChange: "transform, opacity" }}
      aria-hidden="true"
    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && <span
      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
      style={{ background: "var(--base, #000)" }}
      aria-hidden="true"
    />}
                </>;
    const basePillClasses = "relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[14px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0";
    return <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? <Link
      role="menuitem"
      to={item.href}
      className={basePillClasses}
      style={pillStyle}
      aria-label={item.ariaLabel || item.label}
      onMouseEnter={() => handleEnter(i)}
      onMouseLeave={() => handleLeave(i)}
    >
                      {PillContent}
                    </Link> : <a
      role="menuitem"
      href={item.href}
      className={basePillClasses}
      style={pillStyle}
      aria-label={item.ariaLabel || item.label}
      onMouseEnter={() => handleEnter(i)}
      onMouseLeave={() => handleLeave(i)}
    >
                      {PillContent}
                    </a>}
                </li>;
  })}
          </ul>
        </div>

        <button
    ref={hamburgerRef}
    onClick={toggleMobileMenu}
    aria-label="Toggle menu"
    aria-expanded={isMobileMenuOpen}
    className={`md:hidden rounded-full border flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative ${themeMode === "dark" ? "border-white/20 shadow-[0_12px_24px_-16px_rgba(15,23,42,0.95)]" : "border-slate-300/80 shadow-[0_10px_22px_-14px_rgba(30,41,59,0.35)]"}`}
    style={{ width: "var(--nav-h)", height: "var(--nav-h)", background: shellBackground }}
  >
          <span
    className="hamburger-line w-4 h-0.5 rounded origin-center"
    style={{ background: "var(--pill-bg, #fff)" }}
  />
          <span
    className="hamburger-line w-4 h-0.5 rounded origin-center"
    style={{ background: "var(--pill-bg, #fff)" }}
  />
        </button>
      </nav>

      {
    /* Mobile dropdown */
  }
      <div
    ref={mobileMenuRef}
    className={`md:hidden absolute top-[54px] right-0 left-auto w-56 max-w-[80vw] rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] z-[998] origin-top border ${themeMode === "dark" ? "border-white/10" : "border-slate-300/70"}`}
    style={{ ...cssVars, background: shellBackground }}
  >
        <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {items.map((item) => {
    const defaultStyle = {
      background: "var(--pill-bg, #fff)",
      color: "var(--pill-text, #111)"
    };
    const hoverIn = (e) => {
      e.currentTarget.style.background = "var(--base)";
      e.currentTarget.style.color = "var(--hover-text, #fff)";
    };
    const hoverOut = (e) => {
      e.currentTarget.style.background = "var(--pill-bg, #fff)";
      e.currentTarget.style.color = "var(--pill-text, #111)";
    };
    const linkClasses = "block py-3 px-4 text-center whitespace-nowrap text-[14px] font-semibold uppercase tracking-[0.2px] rounded-[50px] transition-all duration-200";
    return <li key={item.href}>
                {isRouterLink(item.href) ? <Link
      to={item.href}
      className={linkClasses}
      style={defaultStyle}
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      onClick={() => setIsMobileMenuOpen(false)}
    >
                    {item.label}
                  </Link> : <a
      href={item.href}
      className={linkClasses}
      style={defaultStyle}
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      onClick={() => setIsMobileMenuOpen(false)}
    >
                    {item.label}
                  </a>}
              </li>;
  })}
        </ul>
      </div>
    </div>;
};
var stdin_default = PillNav;
export {
  stdin_default as default
};
