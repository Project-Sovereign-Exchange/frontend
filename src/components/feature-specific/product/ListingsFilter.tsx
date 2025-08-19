"use client"
import * as React from "react"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Rating} from "@/components/common/Rating";
import {ListingsFilters} from "@/hooks/useListings";



export function ListingsFilter({ filters, onFiltersChange, onClearFilters } : {filters: ListingsFilters, onFiltersChange: (filters: ListingFilters) => void, onClearFilters: () => void}) {
    return (
        <div className="flex flex-col items-center w-full h-full my-8 space-y-4">
            <div>
                <h1 className="text-2xl font-bold mb-4">Filters</h1>
            </div>
            <Accordion
                type="multiple"
                className="w-full"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger>Language(s)</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <div className="flex items-center gap-3">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">English</Label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Condition</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <div className="flex items-center gap-3">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Mint</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Near Mint</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Lightly Played</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Moderately Played</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Heavily Played</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Damaged</Label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Shipping time</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <p className="text-muted-foreground">In day(s)</p>
                        <RadioGroup defaultValue="1">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="1" id="r1" />
                                <Label htmlFor="r1">1</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="2" id="r2" />
                                <Label htmlFor="r2">2</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="3" id="r3" />
                                <Label htmlFor="r3">3</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="4" id="r4" />
                                <Label htmlFor="r3">4</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="5" id="r5" />
                                <Label htmlFor="r3">5+</Label>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Seller Rating</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <p className="text-muted-foreground">And above</p>
                        <RadioGroup defaultValue="1">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="1" id="r1" />
                                <Label htmlFor="r1">
                                    <Rating
                                        size={20}
                                        value={1}
                                        readOnly={true}
                                    />
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="2" id="r2" />
                                <Label htmlFor="r1">
                                    <Rating
                                        size={20}
                                        value={2}
                                        readOnly={true}
                                    />
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="3" id="r3" />
                                <Label htmlFor="r1">
                                    <Rating
                                        size={20}
                                        value={3}
                                        readOnly={true}
                                    />
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="4" id="r3" />
                                <Label htmlFor="r1">
                                    <Rating
                                        size={20}
                                        value={4}
                                        readOnly={true}
                                    />
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="5" id="r3" />
                                <Label htmlFor="r1">
                                    <Rating
                                        size={20}
                                        value={5}
                                        readOnly={true}
                                    />
                                </Label>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
