import { useEffect, useState } from "react";

export function useThemeMode() {
  const [isDarkTheme, setIsDarkTheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true
  );

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

  return isDarkTheme;
}
