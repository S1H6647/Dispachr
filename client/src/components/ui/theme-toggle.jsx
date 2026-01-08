import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { MoonToSun, SunToMoon } from "./theme-svg";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";

export function ThemeToggle({ className, innerIconSize = "1.2rem" }) {
    const { theme, setTheme } = useTheme();
    const [key, setKey] = React.useState(0);

    // Force re-render of SVG animation when theme changes
    React.useEffect(() => setKey((prev) => prev + 1), [theme]);

    const themeOptions = [
        {
            label: "Light",
            value: "light",
            icon: Sun,
        },
        {
            label: "Dark",
            value: "dark",
            icon: Moon,
        },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "relative size-10 rounded-full bg-card flex items-center justify-center border border-border hover:border-primary/50 transition-colors cursor-pointer",
                        className
                    )}
                    aria-label="Toggle theme"
                >
                    {/* Sun icon - visible in light mode */}
                    <div className="absolute flex justify-center items-center transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
                        <SunToMoon key={`sun${key}`} width={innerIconSize} />
                    </div>
                    {/* Moon icon - visible in dark mode */}
                    <div className="absolute flex justify-center items-center transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100">
                        <MoonToSun key={`moon${key}`} width={innerIconSize} />
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
                {themeOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className="cursor-pointer"
                    >
                        <option.icon className="mr-2 h-4 w-4" />
                        <span>{option.label}</span>
                        {theme === option.value && (
                            <Check className="ml-auto h-4 w-4 stroke-[2.5]" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Simple toggle button variant (no dropdown, just toggles between light/dark)
export function ThemeToggleSimple({ className, innerIconSize = "1.2rem" }) {
    const { theme, toggleTheme } = useTheme();
    const [key, setKey] = React.useState(0);

    React.useEffect(() => setKey((prev) => prev + 1), [theme]);

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative size-10 rounded-full bg-card flex items-center justify-center border border-border hover:border-primary/50 transition-colors cursor-pointer",
                className
            )}
            aria-label="Toggle theme"
        >
            {/* Sun icon - visible in light mode */}
            <div className="absolute flex justify-center items-center transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
                <SunToMoon key={`sun${key}`} width={innerIconSize} />
            </div>
            {/* Moon icon - visible in dark mode */}
            <div className="absolute flex justify-center items-center transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100">
                <MoonToSun key={`moon${key}`} width={innerIconSize} />
            </div>
        </button>
    );
}
