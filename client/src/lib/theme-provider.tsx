import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light"; // Always resolved to either dark or light
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "dark",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      try {
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system") {
          return storedTheme;
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
      return defaultTheme;
    }
  );
  
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
    () => {
      if (theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return theme === "dark" ? "dark" : "light";
    }
  );

  // Set HTML classes based on theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme: "dark" | "light";
    
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      effectiveTheme = theme as "dark" | "light";
    }
    
    setResolvedTheme(effectiveTheme);
    root.classList.add(effectiveTheme);
    root.setAttribute("data-theme", effectiveTheme);
    root.style.colorScheme = effectiveTheme;
    
    // Force a repaint to fix some UI issues
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    document.body.style.backgroundColor = effectiveTheme === "dark" ? "#121212" : "#ffffff";
    document.body.style.color = effectiveTheme === "dark" ? "#ffffff" : "#1e1e1e";
    
    // Debug information for theme switching
    console.log(`Theme set to: ${theme}, Resolved theme: ${effectiveTheme}`);
    
  }, [theme]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      setResolvedTheme(systemTheme);
      root.classList.add(systemTheme);
      root.setAttribute("data-theme", systemTheme);
      root.style.colorScheme = systemTheme;
      
      // Force a repaint with consistent styling
      document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
      document.body.style.backgroundColor = systemTheme === "dark" ? "#121212" : "#ffffff";
      document.body.style.color = systemTheme === "dark" ? "#ffffff" : "#1e1e1e";
      
      console.log(`System theme changed to: ${systemTheme}`);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
