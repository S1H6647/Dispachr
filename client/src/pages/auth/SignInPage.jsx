import image from "../../assets/loginpage.jpg";
import google from "../../assets/Google.svg";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import "../../css/auth/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function SignInPage() {
    const navigate = useNavigate();
    const { clearAuth, setAuth } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
    } = useForm();

    const onSubmit = async (e) => {
        console.log(e);
        setErrorMessage(""); // Clear previous errors

        try {
            const response = await fetch("/api/auth/login", {
                body: JSON.stringify(e),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            // Try to parse JSON response
            let resData;
            const text = await response.text();
            console.log("Raw response text:", text);
            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            try {
                resData = text ? JSON.parse(text) : {};
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                console.error("Response text that failed to parse:", text);
                // If parsing fails, create a default error response
                resData = {
                    status: false,
                    message:
                        response.status === 401
                            ? "Invalid email or password"
                            : response.status >= 500
                            ? "Server error. Please try again."
                            : "Invalid response from server",
                };
            }

            console.log("Response data:", resData);

            if (resData.status) {
                clearAuth(); // Clear any stale cache
                setAuth(resData.data); // Set new auth state (backend returns 'data', not 'user')
                navigate("/dashboard", { replace: true });
            } else {
                setErrorMessage(
                    resData.message || "Login failed. Please try again."
                );

                if (response.status === 401) {
                    setFocus("email");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage(
                "Network error. Please check your connection and try again."
            );
        }
    };

    return (
        <>
            <div
                className="auth-container"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div className="auth-overlay"></div>
                <div className="auth-box">
                    <div className="welcome-message">
                        <p className="title">Welcome Back!</p>
                        <p className="sub-title">We're glad to see you again</p>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="input-fields space-y-5"
                    >
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {errorMessage}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10"
                                    aria-invalid={
                                        errors.email ? "true" : "false"
                                    }
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <span className="text-red-500 text-sm">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    aria-invalid={
                                        errors.password ? "true" : "false"
                                    }
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message:
                                                "Password must contain atleast 8 characters",
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                            message:
                                                "Password must contain uppercase, lowercase, and number",
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-red-500 text-sm">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-row justify-between items-center font-medium">
                            <div>
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    className="m-1"
                                    name="isRemember"
                                    {...register("isRemember")}
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="remember-me"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-blue-600 hover:underline">
                                <Link to="/auth/forget-password">
                                    Forget password
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                            >
                                Sign In
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full cursor-pointer"
                            >
                                <img
                                    src={google}
                                    alt="Google"
                                    className="mr-2 w-5 h-5"
                                />
                                Sign in with Google
                            </Button>
                        </div>

                        <div className="text-center">
                            Don't have an account?
                            <Link
                                to="/auth/signup"
                                className="text-blue-600 ml-1 hover:underline"
                            >
                                Sign up for free!
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
