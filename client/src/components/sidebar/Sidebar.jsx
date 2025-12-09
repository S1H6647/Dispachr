import { CloudUpload, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";

const navLinks = [
    {
        name: "Dashboard",
        linkTo: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Posts",
        linkTo: "/posts",
        icon: CloudUpload,
    },
    {
        name: "Nigga",
        linkTo: "/posts",
        icon: CloudUpload,
    },
];

export default function Sidebar() {
    return (
        <>
            <div className="flex flex-col gap-3 bg-amber-400">
                {navLinks.map((nav) => (
                    <NavLink
                        key={nav.name}
                        to={nav.linkTo}
                        className={({ isActive }) =>
                            isActive ? "underline" : ""
                        }
                    >
                        <div className="flex items-center gap-1">
                            {<nav.icon height={"1rem"} width={"1rem"} />}
                            {nav.name}
                        </div>
                    </NavLink>
                ))}
            </div>
        </>
    );
}
