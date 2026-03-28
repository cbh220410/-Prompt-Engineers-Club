import { useEffect, useRef, useState } from "react";
function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = ""
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const initial = {
    up: "translateY(36px)",
    left: "translateX(-36px)",
    right: "translateX(36px)",
    fade: "none"
  };
  return <div
    ref={ref}
    className={className}
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) translateX(0)" : initial[direction],
      transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      willChange: "opacity, transform"
    }}
  >
      {children}
    </div>;
}
export {
  ScrollReveal
};
