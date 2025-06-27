import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button";
import {ShoppingCart} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {CartListItem} from "@/components/feature-specific/cart/CartListItem";

export const CartButton= () => {
    return (
    <Sheet>
        <SheetTrigger asChild>
            <Button className="font-bold bg-primary-foreground text-accent-foreground hover:text-primary-foreground">
                <ShoppingCart/>
            </Button>
        </SheetTrigger>
        <SheetContent className="px-4 py-4 min-w-xl">
            <SheetHeader>
                <div className="flex items-center justify-between p-4">
                <SheetTitle className="text-xl">
                    Shopping Cart
                </SheetTitle>
                <SheetTitle className="text-xl">
                    2 Items
                </SheetTitle>
                </div>
            </SheetHeader>

            <Separator/>
            <CartListItem/>
            <Separator/>
            <Button className="w-full mt-4">
                Checkout
            </Button>
        </SheetContent>
    </Sheet>
    )
}