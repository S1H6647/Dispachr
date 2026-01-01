import { SidebarTrigger } from "../ui/sidebar";
import pfp from "../../assets/logo.webp";

export function Header({
    title,
    icon,
    isSubheader = false,
    isDashboard = false,
}) {
    return (
        <>
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
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
                                {isSubheader && (
                                    <p className="text-sm text-gray-500">
                                        Welcome back. Here's your post overview.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {isDashboard && (
                        <div>
                            <img
                                src={pfp}
                                alt="Profile pic"
                                className="size-11 rounded-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}
