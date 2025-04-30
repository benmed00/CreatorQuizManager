import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  
  // Only render theme toggle after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    console.log("Theme toggle mounted, current theme:", theme, "resolved:", resolvedTheme);
  }, [theme, resolvedTheme]);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    console.log("Toggling theme from", resolvedTheme, "to", newTheme);
    setTheme(newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`,
      description: `Switched to ${newTheme} mode`,
      duration: 2000,
    });
  };
  
  const applyTheme = (themeValue: "light" | "dark" | "system") => {
    console.log("Applying theme:", themeValue);
    setTheme(themeValue);
    toast({
      title: `${themeValue.charAt(0).toUpperCase() + themeValue.slice(1)} theme activated`,
      description: themeValue === "system" 
        ? "Using your system preferences" 
        : `Switched to ${themeValue} mode`,
      duration: 2000,
    });
  };

  // Don't render anything before client-side mount to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border-primary/20 bg-transparent opacity-0"
        aria-label="Loading theme toggle"
      >
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-primary/20 bg-transparent"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500 transition-all" />
          ) : (
            <Moon className="h-5 w-5 text-blue-700 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => applyTheme("light")}>
          <Sun className="mr-2 h-4 w-4 text-yellow-600" />
          <span>Light</span>
          {theme === "light" && <span className="ml-2 text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("dark")}>
          <Moon className="mr-2 h-4 w-4 text-blue-700" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-2 text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-2 text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
