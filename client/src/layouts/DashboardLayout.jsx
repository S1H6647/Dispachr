import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="flex h-dvh">
            <Sidebar />
            <Outlet />
        </div>
    );
}
