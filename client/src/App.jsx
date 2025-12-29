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

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Posts = lazy(() => import("./pages/posts/Posts"));

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
                        <Route path="/all-posts" element={<AllPosts />}></Route>
                        <Route
                            path="/all-posts/twitter"
                            element={<TwitterPosts />}
                        ></Route>
                        <Route
                            path="/all-posts/facebook"
                            element={<FacebookPosts />}
                        ></Route>
                    </Route>

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

