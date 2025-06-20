import Image from "next/image";

export const SearchResult = () => {
    return (
        <div className="flex flex-row items-center justify-start h-full w-full">
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
                <h1>
                    Name
                </h1>
                <p>
                    Game - Expansion - Set
                </p>

                <h1>
                    From: $0.00
                </h1>
                <p>
                    18 Sellers - 1000+ Available
                </p>
            </div>
        </div>
    );
}