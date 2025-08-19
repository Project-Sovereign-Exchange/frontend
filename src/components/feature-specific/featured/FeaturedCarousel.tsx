"use client";
import * as React from "react"

import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {SearchableProduct, searchApi, SearchResponse} from "@/lib/api/endpoints/search";
import {ApiResponse} from "@/lib/api/client";
import {buildProductImageUrlWithSize} from "@/util/images";
import Image from "next/image";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import {Spinner} from "@/components/common/Spinner";


export function FeaturedCarousel() {

    const [results, setResults] = React.useState<SearchResponse<SearchableProduct> | null >(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        setTimeout(async () => {

            try {
                const fetchedResults: ApiResponse<SearchResponse<SearchableProduct>> = await searchApi.trending()

                if (!fetchedResults.success || !fetchedResults.data) {
                    throw new Error(fetchedResults.message || 'Failed to fetch products');
                }

                setResults(fetchedResults.data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch products');
                setLoading(false);
            } finally {
                setLoading(false);
            }

        }, 1000);
    }, []);

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full px-8"
        >
            <CarouselContent className="flex flex-row justify-center w-full">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Spinner />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64 text-red-500">
                        <span>{error}</span>
                    </div>
                ) : results ? (
                    results.hits.map((product) => (
                        <CarouselItem key={product.id} className="md:basis-1/4 lg:basis-1/5 sm:basis-1/2 basis-full">
                            <Link href={`/marketplace/products/${product.id}`}>
                                <div className="relative overflow-hidden rounded-lg group cursor-pointer">
                                    <Image
                                        src={buildProductImageUrlWithSize(
                                            product.game || 'accessories',
                                            product.id,
                                            'Default',
                                            'front',
                                            'medium'
                                        )}
                                        alt={product.name}
                                        width={150}
                                        height={200}
                                        className="object-cover w-full transition-all duration-300"
                                    />

                                    <div className="absolute bottom-2 left-0 right-0 mx-2 bg-white/80 backdrop-blur-sm p-3 transition-all duration-300 rounded-lg border border-white/50 shadow-sm group-hover:shadow-md">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-semibold text-primary truncate">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs truncate text-gray-700">
                                                    {product.game}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <span>No products found</span>
                    </div>
                )}
            </CarouselContent>
        </Carousel>
    )
}