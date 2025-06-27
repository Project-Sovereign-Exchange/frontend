"use client";
import Image from "next/image";
import {useRouter} from "next/navigation";


export const SearchResult = () => {
    const router = useRouter()

    return (
        <div className="flex flex-row items-center justify-start h-full w-full hover:bg-accent cursor-pointer rounded-lg" onClick={() => router.push('/marketplace/product')}>
            <div>
                <Image
                    src="/images/logo.png"
                    alt="Search Result Placeholder"
                    width={150}
                    height={150}
                    className="rounded-2xl object-cover mx-auto"
                />
            </div>
            <div className="flex flex-col justify-start h-full mx-4">
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                    Name
                </h1>
                <p className="text-sm text-muted-foreground mb-2">
                    Game - Expansion - Set
                </p>

                <h1 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
                    From: $0.00
                </h1>
                <p className="text-sm text-muted-foreground mb-2">
                    18 Sellers - 1000+ Available
                </p>
            </div>
        </div>
    );
}