import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ErrorPage from "./pages/auth/ErrorPage";
import { lazy } from "react";
import { AllPosts } from "./pages/posts/AllPosts";
import { TwitterPosts } from "./pages/posts/TwitterPosts";
import { FacebookPosts } from "./pages/posts/FacebookPosts";
import SettingPage from "./pages/settings/SettingPage";
import GetHelp from "./pages/help/GetHelp";

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const CreatePosts = lazy(() => import("./pages/posts/CreatePosts"));

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
                        <Route path="/posts" element={<CreatePosts />}></Route>
                        <Route path="/all-posts" element={<AllPosts />}></Route>
                        <Route
                            path="/all-posts/twitter"
                            element={<TwitterPosts />}
                        ></Route>
                        <Route
                            path="/all-posts/facebook"
                            element={<FacebookPosts />}
                        ></Route>
                        <Route
                            path="/settings"
                            element={<SettingPage />}
                        ></Route>
                        <Route path="/help" element={<GetHelp />}></Route>
                    </Route>

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

