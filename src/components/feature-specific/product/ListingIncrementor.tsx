import {Button} from "@/components/ui/button";
import {Minus, Plus, ShoppingCart} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";


export const ListingIncrementor = () => {
    return (
        <div className="flex flex-row items-stretch">
            <Select>
                <SelectTrigger className="rounded-r-none">
                    <SelectValue placeholder="1" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Amount</SelectLabel>
                        <SelectItem value="apple">1</SelectItem>
                        <SelectItem value="banana">2</SelectItem>
                        <SelectItem value="blueberry">3</SelectItem>
                        <SelectItem value="grapes">4</SelectItem>
                        <SelectItem value="pineapple">5</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button className="rounded-l-none">
                <ShoppingCart/>
            </Button>
        </div>
    );
}