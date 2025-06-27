import {Incrementor} from "@/components/common/Incrementor";
import Image from "next/image";
import {Separator} from "@/components/ui/separator";


export const CartListItem = () => {
    return (
        <div className="flex flex-row items-center justify-between p-3">
            <div className="flex flex-row justify-between">
            <Image
                src="/images/placeholder-card.jpg"
                alt="Product Image"
                width={50}
                height={50}
                className="rounded-md"
            />

            <div className="flex flex-col justify-between p-4">
                <h1 className="text-lg font-semibold">
                    Product Name
                </h1>
                <p className="text-sm text-muted-foreground">
                    $19.99
                </p>
            </div>
            </div>

            <Incrementor/>
        </div>
    );
}