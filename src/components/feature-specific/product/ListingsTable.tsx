import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Listing} from "@/components/feature-specific/product/Listing";


export function ListingsTable() {
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

            <div className="flex flex-row items-start justify-between w-full px-8 mt-4">
                <h1>
                    Name
                </h1>

                <h1>
                    Price
                </h1>

                <h1>
                    Language
                </h1>

                <h1>
                    Condition
                </h1>

                <h1 className="justify-start">
                    Amount
                </h1>
            </div>

            <div className="flex flex-col items-start justify-between w-full px-4 mt-4">
                <Listing/>
                <Listing/>
            </div>
        </div>
    )
}