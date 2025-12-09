import "../css/ui/InputField.css";
import { useState } from "react";
import { useForm } from "react-hook-form";

function InputField({
    title,
    inputType,
    placeholder,
    leadingIcon,
    trailingIcon,
    trailingIconOff,
    register,
    error,
    ariaInvalid,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [currentInputType, setCurrentInputType] = useState(inputType);

    const handleToggle = () => {
        setShowPassword(!showPassword);
        setCurrentInputType(showPassword ? "password" : "text");
    };

    return (
        <>
            <p className="label">{title}</p>
            <div className="input-container">
                <span className="leading-icon">{leadingIcon}</span>
                <input
                    {...register}
                    type={currentInputType}
                    placeholder={placeholder}
                    className="input-field"
                    aria-invalid={ariaInvalid}
                />
                {trailingIcon && (
                    <span className="trailing-icon" onClick={handleToggle}>
                        {showPassword ? trailingIconOff : trailingIcon}
                    </span>
                )}
            </div>

            {error && (
                <span className="text-red-500 block ml-3 text-[14px]">
                    {error.message}
                </span>
            )}
        </>
    );
}

export default InputField;
