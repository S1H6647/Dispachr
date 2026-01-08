import image from "../../assets/loginpage.jpg";
import google from "../../assets/Google.svg";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import "../../css/auth/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import {
    EyeIcon,
    EyeOffIcon,
    LockIcon,
    MailIcon,
    UserRoundIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { ThemeToggleSimple } from "../../components/ui/theme-toggle";
import ParticlesBackground from "../../components/ui/particles-background";

export default function SignUpPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        register,
        watch,
        handleSubmit,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch("password");

    async function onSubmit(e) {
        try {
            console.log(e);

            const response = await fetch("/api/users/", {
                body: JSON.stringify(e),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log(data);
            if (data.status) {
                toast.success(data.message);
                navigate("/dashboard", { replace: true });
            } else {
                toast.error(data.message);
                //` Focus email input if email already exists (409 is conflict)
                if (response.status === 409) {
                    setFocus("email");
                }
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Something went wrong. Please try again.");
        }
    }

    return (
        <>
            <div
                className="auth-container"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div className="auth-overlay"></div>
                <ParticlesBackground />
                <div className="absolute top-4 right-4 z-10">
                    <ThemeToggleSimple />
                </div>
                <div className="auth-box">
                    <div className="welcome-message">
                        <p className="title">Welcome Aboard!</p>
                        <p className="sub-title">
                            We're excited to have you here
                        </p>
                    </div>

                    <form
                        className="input-fields space-y-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <UserRoundIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="pl-10"
                                    aria-invalid={
                                        errors.fullName ? "true" : "false"
                                    }
                                    {...register("fullName", {
                                        required: "Full Name is required",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "Name must contain atleast 3 characters",
                                        },
                                        pattern: {
                                            value: /^([a-zA-Z0-9_\s]+)$/,
                                            message:
                                                "Name can only contain letters and spaces",
                                        },
                                    })}
                                />
                            </div>
                            {errors.fullName && (
                                <span className="text-red-500 text-sm">
                                    {errors.fullName.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
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
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    aria-invalid={
                                        errors.confirmPassword
                                            ? "true"
                                            : "false"
                                    }
                                    {...register("confirmPassword", {
                                        required:
                                            "Please confirm your password",
                                        validate: (value) =>
                                            value === password ||
                                            "Passwords do not match",
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-sm">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing Up..." : "Sign Up"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    console.log("Google sign-up clicked");
                                }}
                            >
                                <img
                                    src={google}
                                    alt="Google"
                                    className="mr-2 w-5 h-5"
                                />
                                Sign up with Google
                            </Button>
                        </div>
                        <div className="text-center">
                            Already have an account?
                            <Link
                                to="/auth/signin"
                                className="text-blue-600 ml-1 hover:underline"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
