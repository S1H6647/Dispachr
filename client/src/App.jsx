import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ErrorPage from "./pages/auth/ErrorPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Posts from "./pages/posts/Posts";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route
                            index
                            element={<Navigate to="/auth/signin" replace />}
                        ></Route>
                        <Route path="signin" element={<SignInPage />} />
                        <Route path="signup" element={<SignUpPage />} />
                    </Route>

                    <Route element={<DashboardLayout />}>
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        ></Route>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        ></Route>
                        <Route path="/posts" element={<Posts />}></Route>
                    </Route>

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

