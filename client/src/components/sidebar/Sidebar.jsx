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
];

export default function Sidebar() {
    return (
        <>
            <div className="flex flex-col items-start gap-3 bg-amber-400 w-50 p-3">
                {navLinks.map((nav) => (
                    <NavLink
                        key={nav.name}
                        to={nav.linkTo}
                        className={({ isActive }) =>
                            isActive ? "underline" : ""
                        }
                    >
                        <div className="flex items-center gap-1 hover:bg-amber-100 w-full pr-3">
                            {<nav.icon height={"1.2rem"} width={"1.2rem"} />}
                            {nav.name}
                        </div>
                    </NavLink>
                ))}
            </div>
        </>
    );
}
