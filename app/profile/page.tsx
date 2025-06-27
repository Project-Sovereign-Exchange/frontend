import Image from "next/image";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {SellerCarousel} from "@/components/feature-specific/profile/SellerCarousel";
import {Separator} from "@/components/ui/separator";
import {Rating} from "@/components/common/Rating";
import {Flag, Mail} from "lucide-react";
import {Button} from "@/components/ui/button";


export default function ProfilePage() {
    return (
            <div className="flex flex-col p-8 w-full min-h-screen">
                <div className="flex flex-row items-center pt-50 pb-20 space-x-20 justify-center">

                    <div className="flex flex-col items-center space-y-2">
                    <Image
                        src="/images/logo.png"
                        alt="Sovereign Logo"
                        width={200}
                        height={200}
                        className="object-cover mx-auto rounded-full mb-4"
                    />

                    <h1 className="font-bold text-2xl leading-tight">
                        Username
                    </h1>
                    <p className="text-muted-foreground">
                        User
                    </p>
                        <Button>
                            <Mail/>Contact
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col mt-6 w-full">
                    <div className="flex flex-row space-x-8 mb-6">
                        <div className="flex flex-row justify-between bg-card w-full p-10 rounded-lg shadow-md outline 1 outline-border">
                            <div className="flex flex-col space-y-2">
                                <h1 className="font-bold text-xl leading-tight mb-2">
                                    Avg. Rating
                                </h1>
                                <Rating value={4.5} readOnly/>
                                <p className="text-muted-foreground">
                                    Based on x reviews
                                </p>
                            </div>
                            <Separator orientation="vertical" className="min-h-full bg-primary"/>
                            <div className="flex flex-col space-y-2 pr-5">
                                <h1 className="font-bold text-xl leading-tight mb-2">
                                    Sales
                                </h1>
                                <p>
                                    1000+ Sales
                                </p>
                                <p className="text-muted-foreground">
                                    1000+ active listings
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between bg-card w-full p-6 rounded-lg shadow-md outline 1 outline-border">
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-row items-center justify-between">
                                    <h1 className="font-bold text-xl leading-tight mb-2">
                                        About
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Member since - <span className="font-semibold">January 2023</span>
                                    </p>
                                </div>
                                <p className="text-muted-foreground">
                                    This is a sample user profile page. Here you can find information about the user, their average rating, and sales statistics.
                                </p>
                            </div>

                            <div className="flex flex-row items-center justify-between space-x-2 mt-4">
                                <div className="flex flex-row items-center space-x-2">
                                <p className="text-muted-foreground">From:</p>
                                <Flag/>
                                </div>

                                <p className="text-muted-foreground">7+ days to you</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full items-center justify-center p-16">
                        <SellerCarousel/>
                    </div>
                </div>
            </div>
    )
}