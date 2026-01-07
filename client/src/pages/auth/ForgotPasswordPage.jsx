import image from "../../assets/loginpage.jpg";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import "../../css/auth/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, ArrowLeftIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/forget-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            const resData = await response.json();

            console.log(resData);

            if (resData.status) {
                toast.success("Password reset link sent to your email!");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
            navigate("/auth/signin");
        }
    };

    return (
        <div
            className="auth-container"
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className="auth-overlay"></div>
            <div className="auth-box">
                <div className="welcome-message">
                    <p className="title">Forgot Password?</p>
                    <p className="sub-title text-center px-4">
                        Enter your email address and we'll send you a link to
                        reset your password.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="input-fields space-y-6 mt-8"
                >
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your registered email"
                                className="pl-10"
                                aria-invalid={errors.email ? "true" : "false"}
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

                    <Button
                        type="submit"
                        className="w-full cursor-pointer text-base font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending Link..." : "Send Reset Link"}
                    </Button>

                    <div className="text-center flex items-center justify-center gap-2">
                        <Link
                            to="/auth/signin"
                            className="text-blue-600 hover:underline flex items-center justify-center gap-2 font-medium"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
