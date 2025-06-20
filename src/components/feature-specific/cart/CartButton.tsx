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

export const CartButton= () => {
    return (
    <Sheet>
        <SheetTrigger asChild>
            <Button className="font-bold bg-primary-foreground text-accent-foreground hover:text-primary-foreground">
                <ShoppingCart/>
            </Button>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>
    )
}