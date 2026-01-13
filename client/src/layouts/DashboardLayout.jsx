import { Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { FullScreenLoader, PageLoader } from "@/components/ui/loading-spinner";

export default function DashboardLayout() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return <FullScreenLoader text="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/signin" replace />;
    }

    return (
        <SidebarProvider className="flex min-h-screen">
            <AppSidebar />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </SidebarProvider>
    );
}
