"use client";
import React from "react";
import { useState } from "react"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {SettingsStepper} from "@/components/feature-specific/settings/components/SettingsStepper";
import {Mail, Phone, Smartphone} from "lucide-react";


export const TwoFactor = () => {
    const [currentStep, setCurrentStep] = useState(0)

    const statuses = [
        { name: "Email", status: true, icon: <Mail/> },
        { name: "SMS", status: false, icon: <Phone/> },
        { name: "Authenticator App", status: false, icon: <Smartphone/> },
    ]

    const steps = [
        {
            id: "email",
            content: (
                <div className="flex items-center gap-2">
                    {statuses[0].icon}
                    <span>{statuses[0].name}</span>
                    <span>
                        {statuses[0].status ? (
                            <Badge>Enabled</Badge>
                        ) : (
                            <Badge variant="destructive">Disabled</Badge>
                        )}
                    </span>
                </div>
            ),
        },
        {
            id: "phone",
            content: (
                <div className="flex items-center gap-2">
                    {statuses[1].icon}
                    <span>{statuses[1].name}</span>
                    <span>
                        {statuses[1].status ? (
                            <Badge>Enabled</Badge>
                        ) : (
                            <Badge variant="destructive">Disabled</Badge>
                        )}
                    </span>
                </div>
            ),
        },
        {
            id: "authenticator",
            content: (
                <div className="flex items-center gap-2">
                    {statuses[2].icon}
                    <span>{statuses[2].name}</span>
                    <span>
                        {statuses[2].status ? (
                            <Badge>Enabled</Badge>
                        ) : (
                            <Badge variant="destructive">Disabled</Badge>
                        )}
                    </span>
                </div>
            ),
        },
    ]

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <SettingsStepper steps={steps} currentStep={currentStep} />

            <div className="flex justify-between pt-4">
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                >
                    Previous
                </Button>
                <Button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep === steps.length - 1}
                >
                    Next
                </Button>
            </div>
        </div>
    )
};