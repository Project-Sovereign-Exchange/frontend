import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Listing} from "@/components/feature-specific/product/Listing";
import {Spinner} from "@/components/common/Spinner";

export function ListingsTable({listings, loading, error, onRefresh} : {listings: Listing[], loading: boolean, error: string | null, onRefresh: () => void}) {
    return (
        <div className="w-full flex flex-col items-center my-8">
            <div className="flex flex-row items-center justify-between w-full px-8">
                <h1 className="w-full text-2xl font-bold mb-4 mx-auto">
                    Listings
                </h1>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full grid grid-cols-5 gap-4 px-8 py-4 font-semibold text-sm text-muted-foreground">
                <div className="flex items-center pl-4">
                    <h1>Name</h1>
                </div>
                <div className="text-center">
                    <h1>Price</h1>
                </div>
                <div className="text-center">
                    <h1>Language</h1>
                </div>
                <div className="text-center">
                    <h1>Condition</h1>
                </div>
                <div className="text-center">
                    <h1>Amount</h1>
                </div>
            </div>

            <div className="w-full px-4 mt-4">
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Spinner/>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-destructive">{error}</p>
                    </div>
                )}

                {!listings.length && !loading && !error && (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">No listings found.</p>
                    </div>
                )}

                {listings.length > 0 && !loading && !error && (
                    <div className="flex flex-col items-start justify-between w-full">
                        {listings.map((listing) => (
                            <Listing
                                key={listing.id}
                                listing={listing}
                                onRefresh={onRefresh}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}