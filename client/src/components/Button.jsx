import "../css/Button.css";

export default function Button({
    title,
    buttonType = "button",
    onClick,
    leadingIcon,
    varient = "primary",
}) {
    if (varient === "primary") {
        return (
            <>
                <button
                    type={buttonType}
                    onClick={onClick}
                    className="primary-button"
                >
                    {title}
                </button>
            </>
        );
    } else if (varient === "secondary") {
        return (
            <>
                <button
                    type={buttonType}
                    onClick={onClick}
                    className="secondary-button"
                >
                    {title}
                </button>
            </>
        );
    }
}
