import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Funnel} from "lucide-react";
import {BadgeWithDismiss} from "@/components/feature-specific/search/BadgeWithDismiss";
import {SearchResult} from "@/components/feature-specific/search/SearchResult";
import {Separator} from "@/components/ui/separator";
import {Filters} from "@/components/feature-specific/search/Filters";

const filters = [
    { name: 'All', value: 'all' },
    { name: 'Images', value: 'images' },
    { name: 'Videos', value: 'videos' },
    { name: 'News', value: 'news' },
];

export const SearchResults = () => {
    return (
        <div className="w-full flex flex-col items-center h-full px-8">
            <div className="flex flex-row w-full justify-start items-center space-x-4">
                <Sheet>
                    <SheetTrigger>
                        <div
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 outline-border h-9 px-4 py-2 has-[>svg]:px-3"
                        >
                            <Funnel/>
                            <span className="hidden md:inline">Filters</span>
                            <span className="md:hidden">Filters</span>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Filter</SheetTitle>
                            <SheetDescription>
                                Select a filter to include in your search results.
                            </SheetDescription>
                        </SheetHeader>

                        <Filters/>
                    </SheetContent>
                </Sheet>

                <BadgeWithDismiss />
            </div>

            <div className="w-full flex flex-col items-center justify-center p-6 md:p-10 my-4 space-y-4 bg-card rounded-lg shadow-lg outline-1 outline-border">
                <SearchResult/>
                <Separator/>
                <SearchResult/>
            </div>
        </div>
    );
}