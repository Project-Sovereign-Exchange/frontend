import Image from 'next/image';
import {Separator} from "@/components/ui/separator";
import {ListingsTable} from "@/components/feature-specific/product/ListingsTable";
import {ListingsFilter} from "@/components/feature-specific/product/ListingsFilter";

export default function ProductPage() {
    return (
        <div className="flex flex-col justify-start min-h-screen min-w-screen px-8 mt-60">
            <div className="bg-card rounded-lg shadow-lg outline-1 outline-border w-full flex flex-row p-8">
                <Image
                    src="/images/placeholder-card.jpg"
                    alt="Product Image"
                    width={250}
                    height={300}
                    className="rounded-lg"
                />

            </div>

            <div className="flex flex-row flex-1">
                <div className="flex flex-col min-w-1/5 ml-10">
                    <ListingsFilter/>
                </div>
                <Separator orientation="vertical" className="min-h-full bg-primary" />
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <h1>
                            Listings
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}