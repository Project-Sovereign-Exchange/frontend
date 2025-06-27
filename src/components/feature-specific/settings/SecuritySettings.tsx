import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {TwoFactor} from "@/components/feature-specific/settings/components/TwoFactor";
import {Mail} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SessionList} from "@/components/feature-specific/settings/components/SessionList";


export const SecuritySettings = () => {
    return (
        <div className="w-full px-8 flex flex-col items-start justify-start space-y-4">
            <div className="flex flex-row mt-15 w-full">
                <div className="flex-1 flex-col items-start justify-start space-y-2">
                    <h1 className="font-semibold text-xl">
                        Contact Details
                    </h1>
                    <p className="text-muted-foreground">
                        Update your contact details to ensure you receive important notifications and updates about your account.
                    </p>
                </div>
                <div className="flex-1 flex-col items-start justify-start space-y-6 ml-4">

                    <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Email" className="w-80"/>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" placeholder="Phone number" className="w-80"/>
                    </div>

                </div>
            </div>

            <div className="w-full px-8 my-8">
                <Separator/>
            </div>

            <div className="flex flex-row mt-10 w-full">
                <div className="flex-1 flex-col items-start justify-start space-y-2">
                    <h1 className="font-semibold text-xl">
                        Two Factor Auth
                    </h1>
                    <p className="text-muted-foreground">
                        Enable two-factor authentication to add an extra layer of security to your account. This will require a verification code in addition to your password when logging in.
                    </p>
                </div>
                <div className="flex-1 flex-col items-start justify-start space-y-6 ml-4">
                    <TwoFactor/>
                </div>
            </div>

            <div className="w-full px-8 my-8">
                <Separator/>
            </div>

            <div className="flex flex-row mt-10 w-full">
                <div className="flex-1 flex-col items-start justify-start space-y-2">
                    <h1 className="font-semibold text-xl">
                        Sessions
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage your active sessions. You can log out of all other sessions to ensure your account is secure.
                    </p>
                </div>
                <div className="flex-1 flex-col items-start justify-start space-y-6 ml-4">

                    <SessionList/>

                </div>
            </div>
        </div>
    )
}