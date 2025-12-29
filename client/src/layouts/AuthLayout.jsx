import { PageLoader } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";
import { Navigate, Outlet, replace } from "react-router-dom";

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated === null) {
        return <PageLoader />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div>
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
}
