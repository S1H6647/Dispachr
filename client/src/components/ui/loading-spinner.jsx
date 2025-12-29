import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function LoadingSpinner({ className, size = "default", text }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2
                className={cn(
                    "animate-spin text-primary",
                    sizeClasses[size],
                    className
                )}
            />
            {text && (
                <p className="text-sm text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}

function PageLoader({ text = "Loading..." }) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

function FullScreenLoader({ text = "Loading..." }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

export { LoadingSpinner, PageLoader, FullScreenLoader };
