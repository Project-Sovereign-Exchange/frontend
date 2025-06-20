import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {
    SelectTrigger,
    Select,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import Link from "next/link";


export const Searchbar = () => {
    return (
        <div className="flex items-center w-full max-w-md">
            <Select>
                <SelectTrigger className="rounded-r-none bg-primary-foreground text-primary w-full max-w-1/4">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Test1</SelectItem>
                    <SelectItem value="dark">Test2</SelectItem>
                    <SelectItem value="system">Test3</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="search"
                placeholder="Search..."
                className="flex-grow bg-primary-foreground text-primary rounded-none"
            />
            <Button className="rounded-l-none">
                <Link href="/marketplace/search">
                    <Search/>
                </Link>
            </Button>
        </div>
    );
}