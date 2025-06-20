import { FeaturedCarousel } from "@/components/feature-specific/featured/FeaturedCarousel";
import {SearchResults} from "@/components/feature-specific/search/SearchResults";


export default function SearchPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-start p-6 mt-50 md:p-10">


            <div className="w-full max-w-sm md:max-w-3xl flex flex-col items-center justify-center">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
                    Trending
                </h2>
                <FeaturedCarousel/>

                <div className="flex flex-column items-center justify-center p-6 md:p-10 space-x-4">
                    <SearchResults />
                </div>
            </div>
        </div>
    );
}