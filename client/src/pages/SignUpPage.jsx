import image from "../assets/loginpage.jpg";
import google from "../assets/Google.svg";
import InputField from "../components/InputField";
import "../css/Auth.css";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import {
    EyeIcon,
    EyeOffIcon,
    LockIcon,
    MailIcon,
    UserRoundIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";

export default function SignUpPage() {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch("password");

    async function onSubmit(data) {
        try {
            console.log(data);
            await new Promise((resolve) => setTimeout(resolve, 5000));
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <>
            <div className="auth-container">
                <div className="credentials-section">
                    <div className="welcome-message">
                        <p className="title">CREATE ACCOUNT</p>
                        <p className="sub-title">
                            Join us by creating your new account
                        </p>
                    </div>

                    <form
                        className="input-fields space-y-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <InputField
                            title={"Full Name"}
                            inputType={"text"}
                            placeholder={"Enter your full name"}
                            leadingIcon={<UserRoundIcon />}
                            register={register("fullName", {
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
                            error={errors.fullName}
                            ariaInvalid={errors.fullName ? "true" : "false"}
                        />

                        <InputField
                            title={"Email"}
                            inputType={"email"}
                            placeholder={"Enter your email"}
                            leadingIcon={<MailIcon />}
                            register={register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: "Invalid email address",
                                },
                            })}
                            error={errors.email}
                            ariaInvalid={errors.email ? "true" : "false"}
                        />

                        <InputField
                            title={"Password"}
                            inputType={"password"}
                            placeholder={"••••••••"}
                            leadingIcon={<LockIcon />}
                            trailingIcon={<EyeIcon />}
                            trailingIconOff={<EyeOffIcon />}
                            register={register("password", {
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
                            error={errors.password}
                            ariaInvalid={errors.password ? "true" : "false"}
                        />

                        <InputField
                            title={"Confirm Password"}
                            inputType={"password"}
                            placeholder={"••••••••"}
                            leadingIcon={<LockIcon />}
                            trailingIcon={<EyeIcon />}
                            trailingIconOff={<EyeOffIcon />}
                            register={register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password ||
                                    "Passwords do not match",
                            })}
                            error={errors.confirmPassword}
                            ariaInvalid={
                                errors.confirmPassword ? "true" : "false"
                            }
                        />

                        <div className="space-y-4">
                            <Button
                                title={
                                    isSubmitting ? "Signing Up..." : "Sign Up"
                                }
                                buttonType={"submit"}
                            />

                            <Button
                                title={
                                    <div className="flex w-full justify-center items-center">
                                        <img
                                            src={google}
                                            alt="Google"
                                            className="mr-2 w-7 h-7"
                                        />
                                        <p>Sign up with Google</p>
                                    </div>
                                }
                                buttonType={"button"}
                                onClick={() => {
                                    console.log("Google sign-up clicked");
                                }}
                                varient="secondary"
                            />
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

                <div className="signin-image">
                    <img
                        src={image}
                        alt="Sign up Page Image"
                        draggable={false}
                    />
                </div>
            </div>
        </>
    );
}
