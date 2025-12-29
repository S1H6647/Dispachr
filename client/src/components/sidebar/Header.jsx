import { GlobeIcon } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

export function Header({ title, icon }) {
    return (
        <>
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
                <div className="flex items-center gap-4 px-6 py-4">
                    <SidebarTrigger className="-ml-2" />
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <div className="h-5 w-5 text-primary flex justify-center items-center">
                                {icon}
                            </div>
                        </div>
                        <h1 className="text-xl font-semibold">{title}</h1>
                    </div>
                </div>
            </header>
        </>
    );
}
