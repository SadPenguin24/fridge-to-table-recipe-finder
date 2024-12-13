"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"; // Shadcn Button component
import { SunIcon, MoonIcon } from "lucide-react"; // Icons from Lucide

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <SunIcon className="w-4 h-4" />
      ) : (
        <MoonIcon className="w-4 h-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
