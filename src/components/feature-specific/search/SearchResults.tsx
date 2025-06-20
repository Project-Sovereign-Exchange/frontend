import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Funnel} from "lucide-react";
import {BadgeWithDismiss} from "@/components/feature-specific/search/BadgeWithDismiss";
import {SearchResult} from "@/components/feature-specific/search/SearchResult";

const filters = [
    { name: 'All', value: 'all' },
    { name: 'Images', value: 'images' },
    { name: 'Videos', value: 'videos' },
    { name: 'News', value: 'news' },
];

export const SearchResults = () => {
    return (
        <div className="w-screen flex flex-col items-center h-full px-8">
            <div className="flex flex-row w-full justify-start items-center space-x-4">
                <Sheet>
                    <SheetTrigger>
                        <Button>
                            <Funnel/>
                            <span className="hidden md:inline">Filters</span>
                            <span className="md:hidden">Filters</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle><h1>Filter</h1></SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

                <BadgeWithDismiss />
            </div>

            <div className="w-full flex flex-col items-center justify-center p-6 md:p-10 my-4 space-y-4 bg-card rounded-lg shadow-lg outline-1 outline-border">
                <SearchResult/>
            </div>
        </div>
    );
}