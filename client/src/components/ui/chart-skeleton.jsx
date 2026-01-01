import React from "react";
import { Skeleton } from "./skeleton";

function ChartSkeleton({ height = 380, ticks = 7 }) {
    return (
        <div className="w-full">
        
            <div className="rounded-md overflow-hidden border p-3 mt-5">
                <div className="mb-3">
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-5 w-70" />
            </div>
                <Skeleton
                    className={`h-${Math.max(
                        24,
                        Math.floor(height / 4)
                    )} w-full`}
                    style={{ height }}
                />

                <div className="mt-3 flex justify-between items-center">
                    {Array.from({ length: ticks }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-10" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export { ChartSkeleton };
