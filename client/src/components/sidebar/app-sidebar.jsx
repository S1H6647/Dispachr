import {
    Gauge,
    FileText,
    CircleQuestionMark,
    Settings,
    TwitterIcon,
    FacebookIcon,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { useEffect, useState } from "react";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Gauge,
        },
        {
            title: "Posts",
            icon: FileText,
            url: "#",
            items: [
                {
                    title: "Create posts",
                    url: "/posts",
                },
                {
                    title: "Web posts",
                    url: "/all-posts",
                },
                {
                    title: "Twitter posts",
                    url: "/all-posts/twitter",
                },
                {
                    title: "Facebook posts",
                    url: "/all-posts/facebook",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
        {
            title: "Get Help",
            url: "/help",
            icon: CircleQuestionMark,
        },
    ],
};

export function AppSidebar({ ...props }) {
    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "/avatars/shadcn.jpg",
    });

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch("/api/users/me", {
                    credentials: "include",
                });

                const userData = await response.json();
                // console.log(userData);
                if (userData.status && userData.user) {
                    setUser({
                        name: userData.user.fullName,
                        email: userData.user.email,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        getUserData();
    }, []);
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <div className="flex items-center justify-center size-6 rounded shrink-0">
                                    <img
                                        src="/dispachr-favicon.png"
                                        alt="Dispachr"
                                    />
                                </div>
                                <span className="text-base font-semibold">
                                    Dispachr
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
