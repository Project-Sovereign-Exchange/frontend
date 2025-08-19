import {Button} from "@/components/ui/button";
import {ListingIncrementor} from "@/components/feature-specific/product/ListingIncrementor";
import {Badge} from "@/components/ui/badge";
import 'flag-icons/css/flag-icons.min.css';

const getConditionStyle = (condition: string) => {
    switch (condition.toLowerCase()) {
        case 'mint':
        case 'new':
        case 'sealed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'near_mint':
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'lightly_played':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'moderately_played':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'heavily_played':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'damaged':
            return 'bg-red-200 text-red-900 border-red-300';
        case 'used':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
            return 'bg-slate-100 text-slate-800 border-slate-200';
    }
};

const formatConditionText = (condition: string) => {
    return condition
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const Listing = ({listing, onRefresh} : {listing: Listing, onRefresh: () => void}) => {
    return (
        <div className="w-full grid grid-cols-5 gap-4 items-center px-8 py-4 hover:bg-accent rounded-lg">
            <div className="flex flex-col justify-center">
                <h1 className="font-semibold">
                    {listing.name}
                </h1>
                <p className="text-muted-foreground">
                    {listing.seller_id}
                </p>
            </div>

            <div className="flex flex-col items-center">
                <h1>
                    {listing.price}€
                </h1>
            </div>

            <div className="flex justify-center">
                <span className="fi fi-gb rounded-md"></span>
            </div>

            <div className="flex justify-center">
                <Badge className={getConditionStyle(listing.condition)}>
                    {formatConditionText(listing.condition)}
                </Badge>
            </div>

            <div className="flex justify-center">
                <div className="flex flex-row space-x-4 bg-primary-foreground rounded-lg">
                    <ListingIncrementor
                        max={listing.quantity}
                    />
                </div>
            </div>
        </div>
    );
}