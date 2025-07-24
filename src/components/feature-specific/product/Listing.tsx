import {Button} from "@/components/ui/button";
import {Flag, ShoppingCart} from "lucide-react";
import {ListingIncrementor} from "@/components/feature-specific/product/ListingIncrementor";
import {Badge} from "@/components/ui/badge";


export const Listing = () => {
  return (
      <div className="w-full flex flex-row justify-between items-center px-8 py-4 hover:bg-accent rounded-lg">
        <div className="flex flex-col">
            <h1 className="font-semibold">
                Product Listing
            </h1>

            <p className="text-muted-foreground">
                Seller - Rating
            </p>
        </div>

          <div className="flex flex-col">
              <h1>
                  5.45$
                </h1>
          </div>

          <Flag/>

          <Badge>
              Condition
          </Badge>

          <div className="flex flex-row space-x-4 bg-primary-foreground rounded-lg">
              <ListingIncrementor/>
          </div>
      </div>
  );
}