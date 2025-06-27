import Image from "next/image";
import {Pencil} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {TwoFactor} from "@/components/feature-specific/settings/components/TwoFactor";
import {SessionList} from "@/components/feature-specific/settings/components/SessionList";


export const AccountSettings = () => {
    return (
    <div className="w-full px-8 flex flex-col items-center justify-start space-y-4">
        <div
            className="relative group transition-all duration-300 mt-15"
        >
            <Image
                src="/images/logo.png"
                alt="Sovereign Logo"
                width={200}
                height={200}
                className="object-cover mx-auto rounded-full mb-4"
            />
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <button
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Edit Image"
                type="button"
                tabIndex={0}
                style={{ width: '100%', height: '100%' }}
            >
                <Pencil className="text-white size-20" />
            </button>
        </div>

        <div className="flex flex-row mt-15 w-full">
            <div className="flex-1 flex-col items-start justify-start space-y-2">
                <h1 className="font-semibold text-xl">
                    Public
                </h1>
                <p className="text-muted-foreground">
                    Update your public details displayed on your profile.
                </p>
            </div>
            <div className="flex-1 flex-col items-start justify-start space-y-6 ml-4">
                <Input placeholder="Username"/>
                <Textarea placeholder="Description" className="resize-none"/>
            </div>
        </div>

        <div className="w-full px-8 my-8">
            <Separator/>
        </div>

        <div className="flex flex-row mt-10 w-full">
            <div className="flex-1 flex-col items-start justify-start space-y-2">
                <h1 className="font-semibold text-xl">
                    Private
                </h1>
                <p className="text-muted-foreground">
                    Update your private details to ensure your account is secure and you can recover it if needed.
                </p>
            </div>
            <div className="flex-1 flex-col items-start justify-start space-y-6 ml-4">
                <Input placeholder="First Name"/>
                <Input placeholder="Last Name"/>
                <Input placeholder="Country" className="mt-12"/>
                <Input placeholder="Address"/>
                <Input placeholder="City"/>
                <Input placeholder="Postal Code"/>
            </div>
        </div>

    </div>
    )
}