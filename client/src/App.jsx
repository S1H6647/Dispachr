import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="auth/signin" element={<SignInPage />} />
                        <Route path="auth/signup" element={<SignUpPage />} />
                        <Route
                            path="auth/*"
                            element={<div>auth not found</div>}
                        />
                    </Route>

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

