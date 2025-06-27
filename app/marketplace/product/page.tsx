"use client";
import Image from 'next/image';
import {Separator} from "@/components/ui/separator";
import {ListingsTable} from "@/components/feature-specific/product/ListingsTable";
import {ListingsFilter} from "@/components/feature-specific/product/ListingsFilter";
import {useState} from "react";
import {RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {PriceChart} from "@/components/feature-specific/product/PriceChart";

export default function ProductPage() {
    const [flipped, setFlipped] = useState(false);

    const imgProps = !flipped
        ? { width: 250, height: 350, src: '/images/product/swu-front.png' }
        : { width: 350, height: 250, src: '/images/product/swu-back.png' };

    return (
        <div className="flex flex-col justify-start min-h-screen w-full px-8 mt-60">
            <div className="bg-card rounded-lg shadow-lg outline-1 outline-border w-full flex flex-row justify-between p-8">
                <div className="flex flex-row">
                <div
                    className="flex flex-col items-center justify-center mr-8"
                    style={{
                        minHeight: 350,
                        minWidth: 350,
                    }}
                >
                <div
                    className="relative group transition-all duration-300"
                    style={{
                        minWidth: imgProps.width,
                        minHeight: imgProps.height,
                    }}
                >
                    <Image
                        src={imgProps.src}
                        alt="Product Image"
                        width={imgProps.width}
                        height={imgProps.height}
                        className="rounded-lg object-cover transition-all duration-300"
                        style={{ width: imgProps.width, height: imgProps.height }}
                        priority
                    />
                    <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <button
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => setFlipped(!flipped)}
                        aria-label="Flip Image"
                        type="button"
                        tabIndex={0}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <RefreshCw className="text-white size-20" />
                    </button>
                </div>
                </div>

                <div>
                    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
                        Obi-Wan Kenobi
                    </h1>
                    <p className="text-sm text-muted-foreground mb-2">
                        Game - Expansion - Set
                    </p>

                    {/*This should be a list of metadata grabbed from the db*/}

                    <h1 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
                        From: $0.00
                    </h1>
                    <p className="text-sm text-muted-foreground mb-2">
                        18 Sellers - 1000+ Available
                    </p>
                </div>
                </div>

                <div className="flex flex-col space-y-4 ml-8">
                    <div>
                    <h2>
                        30-Day Price Trend:
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">
                        Average Price: $0.00
                    </p>
                    </div>

                    <div>
                    <h2>
                        7-Day Price Trend:
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">
                        Average Price: $0.00
                    </p>
                    </div>

                    <div>
                    <h2>
                        24-Hour Price Trend:
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">
                        Average Price: $0.00
                    </p>
                    </div>


                    <PriceChart/>
                    <Button className="bg-primary text-white px-4 py-2 rounded-lg transition-colors">
                        Add to Purchase List
                    </Button>
                </div>
            </div>

            <div className="flex flex-row flex-1">
                <div className="flex flex-col min-w-3/12">
                    <ListingsFilter/>
                </div>
                <Separator orientation="vertical" className="min-h-full w-full bg-primary" />
                <ListingsTable/>
            </div>
        </div>
    );
}