import {Button} from "@/components/ui/button";
import {Minus, Plus} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";


export const Incrementor = () => {
    return (
        <div className="flex flex-row items-stretch">
            <Button className="rounded-r-none">
                <Minus />
            </Button>

            <Select>
                <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="1" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button className="rounded-l-none">
                <Plus />
            </Button>
        </div>
    );
}