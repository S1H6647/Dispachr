import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function extractNameInitial(name) {
    return name
        ?.trim()
        .split(/\s+/)
        .slice(0, 3)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}
