"use client";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {SearchableProduct} from "@/lib/api/endpoints/search";
import {buildProductImageUrlWithSize} from "@/util/images";


export const SearchResult = ({product} : {key: string, product: SearchableProduct}) => {
    const router = useRouter()

    return (
        <div className="flex flex-row items-center justify-start h-full w-full hover:bg-accent cursor-pointer rounded-lg" onClick={() => router.push('/marketplace/product')}>
            <div>
                <Image
                    src={buildProductImageUrlWithSize(
                        product.game || 'accessories',
                        product.id,
                        'Default',
                        'front',
                        'medium'
                    )}
                    alt="Search Result Placeholder"
                    width={100}
                    height={100}
                    className="rounded-xl object-cover mx-auto"
                />
            </div>
            <div className="flex flex-col justify-start h-full mx-4">
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                    {product.name || "Product Name"}
                </h1>
                <p className="text-sm text-muted-foreground mb-2">
                    {product.game || "Game Name"} - {product.set || "Expansion Name"}
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