import { SidebarTrigger } from "../ui/sidebar";
import pfp from "../../assets/logo.webp";
import { ThemeToggleSimple } from "../ui/theme-toggle";

export function Header({ title, icon, subHeader = "" }) {
    return (
        <>
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-card/80 backdrop-blur-sm border-b">
                <div className="flex items-center gap-4 px-6 py-4">
                    <SidebarTrigger className="-ml-2" />
                    <div className="flex items-center gap-3 justify-between w-full">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <div className="h-5 w-5 text-primary flex justify-center items-center">
                                {icon}
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex flex-col justify-center gap-0.5">
                                <h1 className="text-xl font-semibold">
                                    {title}
                                </h1>
                                {subHeader && (
                                    <p className="text-sm text-muted-foreground">
                                        {subHeader}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Animated Theme Toggle */}
                    <ThemeToggleSimple innerIconSize="1.3rem" />
                </div>
            </header>
        </>
    );
}
