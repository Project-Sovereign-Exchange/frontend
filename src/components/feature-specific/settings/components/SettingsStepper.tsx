"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface Step {
    id: string
    content?: React.ReactNode
}

interface SettingsStepperProps {
    steps: Step[]
    currentStep: number
    className?: string
}

export function SettingsStepper({ steps, currentStep, className }: SettingsStepperProps) {
    return (
        <div className={cn("w-full", className)}>
            {steps.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                const isLast = index === steps.length - 1

                return (
                    <div key={step.id} className="relative">
                        {/* Step indicator and content container */}
                        <div className="flex items-start gap-4">
                            {/* Step indicator column - fixed width container */}
                            <div className="flex flex-col items-center">
                                {/* Fixed container for step dot to maintain centering */}
                                <div className="relative flex h-8 w-8 items-center justify-center">
                                    {/* Step dot */}
                                    <div
                                        className={cn(
                                            "flex items-center justify-center rounded-full border-2 transition-all duration-200",
                                            {
                                                // Active step: larger, filled
                                                "h-8 w-8 border-primary bg-primary": isActive,
                                                // Completed step: filled with primary color
                                                "h-6 w-6 border-primary bg-primary": isCompleted && !isActive,
                                                // Incomplete step: empty with border
                                                "h-6 w-6 border-muted-foreground bg-background": !isCompleted && !isActive,
                                            }
                                        )}
                                    >
                                        {/* Inner dot for active/completed states */}
                                        {(isActive || isCompleted) && (
                                            <div
                                                className={cn(
                                                    "rounded-full bg-primary-foreground transition-all duration-200",
                                                    {
                                                        "h-3 w-3": isActive,
                                                        "h-2 w-2": isCompleted && !isActive,
                                                    }
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Connecting line - centered under the fixed container */}
                                {!isLast && (
                                    <div className="mx-2 h-16 w-0.5">
                                        <div
                                            className={cn(
                                                "h-full w-full transition-all duration-300",
                                                {
                                                    "bg-primary": isCompleted,
                                                    "bg-muted-foreground/30": !isCompleted,
                                                }
                                            )}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Step content column */}
                            <div className="flex-1 pb-8">
                                {step.content && (
                                    <div
                                        className={cn(
                                            "transition-opacity duration-200",
                                            {
                                                "opacity-100": isActive,
                                                "opacity-60": isCompleted,
                                                "opacity-30": !isActive && !isCompleted,
                                            }
                                        )}
                                    >
                                        {step.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}