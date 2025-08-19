'use client';

import { FeaturedCarousel } from "@/components/feature-specific/featured/FeaturedCarousel";
import {SearchResults} from "@/components/feature-specific/search/SearchResults";
import {useProductSearch} from "@/hooks/useProductSearch";
import {useEffect} from "react";
import {useSearchParams} from "next/navigation";

export default function SearchPage() {
    const { results, loading, error, searchProducts } = useProductSearch();

    const query = useSearchParams().get("q")
    const game = useSearchParams().get("game")

    useEffect(() => {
        if (query) {
            searchProducts({
                q: query,
                game: game || undefined,
            });
        } else {
            searchProducts({
                q: "",
                sort: 'name_asc',
            });
        }
    }, [query, searchProducts]);

    return (
        <div className="flex w-full min-h-svh flex-col items-center justify-start p-6 mt-50 md:p-10">
            <div className="w-full flex flex-col items-center justify-center">
                {!query && (
                    <div>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
                        Trending
                    </h2>

                    <FeaturedCarousel/>
                    </div>
                )}

                <div className="flex flex-column items-center justify-center p-6 md:p-10 space-x-4 w-full">
                    <SearchResults
                        results={results!}
                        loading={loading}
                        error={error!}
                    />
                </div>
            </div>
        </div>
    );
}