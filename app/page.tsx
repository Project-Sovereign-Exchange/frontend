import Image from "next/image";
import {PinContainer} from "@/components/feature-specific/front-page/pin";

export default function Home() {
    return (
        <div
            className="flex-1 flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)] px-8">
            <div className="pt-60 pb-25">
                <Image
                    src="/images/logo.png"
                    alt="Sovereign Logo"
                    width={350}
                    height={350}
                    className="rounded-2xl object-cover mx-auto"
                />
            </div>

            <div className="w-full flex-1 flex flex-col justify-center items-center">
            <div className="flex flex-row w-full justify-center items-center space-x-4 mb-24 mt-8">
                <PinContainer
                    className="w-[250px] h-[350px]"
                    image="/images/front-page/magic-logo.webp"
                    href={`${process.env.NEXT_PUBLIC_URL}/search`}
                    imageHeight={200}
                    imageWidth={200}
                >
                    <Image
                        src="/images/front-page/magic.jpg"
                        alt="Next.js 14"
                        width={400}
                        height={400}
                        className="rounded-2xl object-cover w-full h-full"
                    />
                </PinContainer>
                <PinContainer
                    className="w-[250px] h-[350px]"
                    image="/images/front-page/swu-logo-2.webp"
                    href={`${process.env.NEXT_PUBLIC_URL}/search`}
                    imageHeight={400}
                    imageWidth={400}
                >
                    <Image
                        src="/images/front-page/swu.webp"
                        alt="Next.js 14"
                        width={400}
                        height={400}
                        className="rounded-2xl object-cover w-full h-full"
                    />
                </PinContainer>
                <PinContainer
                    className="w-[250px] h-[350px]"
                    image="/images/front-page/pokemon-logo.webp"
                    href={`${process.env.NEXT_PUBLIC_URL}/search`}
                    imageHeight={200}
                    imageWidth={200}
                >
                    <Image
                        src="/images/front-page/pokemon.webp"
                        alt="Next.js 14"
                        width={400}
                        height={400}
                        className="rounded-2xl object-cover w-full h-full"
                    />
                </PinContainer>
            </div>
            </div>
        </div>
    );
}
