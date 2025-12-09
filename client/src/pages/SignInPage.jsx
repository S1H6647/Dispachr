import image from "../assets/loginpage.jpg";
import google from "../assets/Google.svg";
import InputField from "../components/InputField";
import "../css/Auth.css";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function SignInPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const { isChecked, setIsChecked } = useState(false);

    const onSubmit = async (e) => {
        console.log(e);

        const response = await fetch("/api/auth/signin", {
            body: JSON.stringify(e),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const resData = await response.json();
        console.log(resData);
    };

    return (
        <>
            <div className="auth-container">
                <div className="credentials-section">
                    <div className="welcome-message">
                        <p className="title">WELCOME BACK</p>
                        <p className="sub-title">
                            Welcome back! Please enter your detials
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="input-fields space-y-5"
                    >
                        <InputField
                            title={"Email"}
                            inputType={"text"}
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
                                <a href="#">Forget password</a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                title={"Sign In"}
                                buttonType={"submit"}
                                onClick={() => {
                                    console.log("This button was clicked");
                                }}
                            />

                            <Button
                                title={
                                    <div className="flex w-full justify-center items-center">
                                        <img
                                            src={google}
                                            alt="Google"
                                            className="mr-2 w-7 h-7"
                                        />
                                        <p>Sign in with google</p>
                                    </div>
                                }
                                buttonType={"button"}
                                onClick={() => {
                                    console.log("This button was clicked");
                                }}
                                leadingIcon={google}
                                varient="secondary"
                            />
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
                <div className="signin-image">
                    <img
                        src={image}
                        alt="Sign in Page Image"
                        draggable={false}
                    />
                </div>
            </div>
        </>
    );
}
