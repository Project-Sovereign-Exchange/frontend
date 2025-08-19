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


export const ListingIncrementor = ({max} : {max: number}) => {
    return (
        <div className="flex flex-row items-stretch">
            <Select>
                <SelectTrigger className="rounded-r-none">
                    <SelectValue placeholder="1" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Amount</SelectLabel>
                        {[...Array(max).keys()].map((i) => (
                            <SelectItem key={i + 1} value={`${i + 1}`}>
                                {i + 1}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button className="rounded-l-none">
                <ShoppingCart/>
            </Button>
        </div>
    );
}