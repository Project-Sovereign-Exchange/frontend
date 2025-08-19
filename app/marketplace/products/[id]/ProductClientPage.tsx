"use client";
import Image from 'next/image';
import {Separator} from "@/components/ui/separator";
import {ListingsTable} from "@/components/feature-specific/product/ListingsTable";
import {ListingsFilter} from "@/components/feature-specific/product/ListingsFilter";
import {useState} from "react";
import {RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {PriceChart} from "@/components/feature-specific/product/PriceChart";
import {Product} from "@/types/product";
import {Variant} from "@/types/variant";
import {buildProductImageUrlWithSize} from "@/util/images";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ListingsSection} from "@/components/feature-specific/product/ListingSection";

export function ProductClientPage({ product, variants }: { product: Product, variants: Variant[] }) {

    const [flipped, setFlipped] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<string>(variants[0]?.name || 'Default');

    const imgProps = !flipped
        ? { width: 250, height: 350, src: buildProductImageUrlWithSize(
            product.game,
            product.id,
            selectedVariant,
            'front',
                'original'
            ) }
        : { width: 350, height: 250, src: buildProductImageUrlWithSize(
            product.game,
            product.id,
            selectedVariant,
            'back',
                'original'
            ) };

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
                                quality={100}
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
                        <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                            <SelectTrigger className="w-full mb-4">
                                <SelectValue placeholder="Select Variant" />
                            </SelectTrigger>
                            <SelectContent>
                                {variants.map((variant) => (
                                    <SelectItem key={variant.id} value={variant.name}>
                                        {variant.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
                            {product.name || "Product Name"}
                        </h1>
                        <p className="text-sm text-muted-foreground mb-2">
                            {product.game || "Game Name"} - {product.set || "Expansion Name"}
                        </p>

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

            <ListingsSection
                productId={product.id}
                selectedVariant={selectedVariant}
            />
        </div>
    );
}