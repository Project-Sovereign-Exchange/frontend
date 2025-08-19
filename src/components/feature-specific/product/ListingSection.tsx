"use client";
import { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { ListingsTable } from "./ListingsTable";
import { ListingsFilter } from "./ListingsFilter";
import { useListings } from "@/hooks/useListings";

interface ListingsSectionProps {
    productId: string;
    selectedVariant: string;
}

export function ListingsSection({ productId, selectedVariant }: ListingsSectionProps) {
    const {
        listings,
        filters,
        loading,
        error,
        updateFilters,
        clearFilters,
        refetch
    } = useListings(productId, selectedVariant);

    return (
        <div className="flex flex-row flex-1">
            <div className="flex flex-col min-w-3/12">
                <ListingsFilter
                    filters={filters}
                    onFiltersChange={updateFilters}
                    onClearFilters={clearFilters}
                />
            </div>
            <Separator orientation="vertical" className="min-h-full w-full bg-primary" />
            <ListingsTable
                listings={listings}
                loading={loading}
                error={error}
                onRefresh={refetch}
            />
        </div>
    );
}