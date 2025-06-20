'use client';

import * as React from "react";
import { Star, StarHalf, Star as StarOutline } from "lucide-react";
import { cn } from "@/lib/utils"; // adjust import if you don't have cn utility

type RatingProps = {
    value: number;
    max?: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    size?: number;
    className?: string;
    "aria-label"?: string;
};

export function Rating({
                           value,
                           max = 5,
                           onChange,
                           readOnly = false,
                           size = 24,
                           className,
                           "aria-label": ariaLabel = "Rating",
                       }: RatingProps) {
    // Clamp value between 0 and max
    const rounded = Math.round(value * 2) / 2;
    const stars = [];
    for (let i = 1; i <= max; i++) {
        if (rounded >= i) {
            stars.push("full");
        } else if (rounded + 0.5 === i) {
            stars.push("half");
        } else {
            stars.push("empty");
        }
    }

    const [hovered, setHovered] = React.useState<number | null>(null);
    const isInteractive = typeof onChange === "function" && !readOnly;

    const getDisplay = (idx: number) => {
        if (hovered !== null) {
            if (hovered >= idx + 1) return "full";
            if (hovered >= idx + 0.5) return "half";
            return "empty";
        }
        return stars[idx];
    };

    const handleClick = (idx: number, half: boolean) => {
        if (!isInteractive) return;
        const newValue = half ? idx + 0.5 : idx + 1;
        onChange && onChange(newValue);
    };

    const handleMouseMove = (e: React.MouseEvent, idx: number) => {
        if (!isInteractive) return;
        const { left, width } = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - left;
        setHovered(x < width / 2 ? idx + 0.5 : idx + 1);
    };

    const handleMouseLeave = () => setHovered(null);

    return (
        <div
            className={cn("flex items-center gap-0.5", className)}
            aria-label={ariaLabel}
            role={isInteractive ? "slider" : "img"}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            tabIndex={isInteractive ? 0 : undefined}
            onKeyDown={
                isInteractive
                    ? (e) => {
                        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                            e.preventDefault();
                            onChange && onChange(Math.max(0, value - 0.5));
                        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                            e.preventDefault();
                            onChange && onChange(Math.min(max, value + 0.5));
                        }
                    }
                    : undefined
            }
        >
            {Array.from({ length: max }).map((_, idx) => {
                const display = getDisplay(idx);
                const iconProps = {
                    size,
                    className: cn(
                        "transition-colors",
                        display !== "empty" ? "text-yellow-400" : "text-muted-foreground"
                    ),
                    "aria-hidden": true,
                };

                return (
                    <span
                        key={idx}
                        className={cn("relative flex cursor-pointer select-none", {
                            "cursor-default": !isInteractive,
                        })}
                        onClick={
                            isInteractive
                                ? (e) => {
                                    const { left, width } = (e.target as HTMLElement).getBoundingClientRect();
                                    const x = e.clientX - left;
                                    handleClick(idx, x < width / 2);
                                }
                                : undefined
                        }
                        onMouseMove={(e) => handleMouseMove(e, idx)}
                        onMouseLeave={handleMouseLeave}
                        tabIndex={-1}
                        role="presentation"
                        aria-label={`${idx + 1} star`}
                    >
            {display === "full" ? (
                <Star fill="currentColor" stroke="currentColor" {...iconProps} />
            ) : display === "half" ? (
                <span className="relative inline-flex">
                <StarHalf fill="currentColor" stroke="currentColor" {...iconProps} />
                    {/* Optional: Overlay half empty star for visual clarity */}
                    <StarOutline
                        fill="none"
                        stroke="currentColor"
                        {...iconProps}
                        className={cn(iconProps.className, "absolute left-0 top-0 pointer-events-none")}
                    />
              </span>
            ) : (
                <StarOutline fill="none" stroke="currentColor" {...iconProps} />
            )}
          </span>
                );
            })}
        </div>
    );
}