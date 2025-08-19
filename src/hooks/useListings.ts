"use client";
import { useState, useEffect, useCallback } from 'react';
import {Listing, listingsApi} from "@/lib/api/endpoints/listings";

export interface ListingsFilters {
    condition?: string;
    priceRange?: { min: number; max: number };
    seller?: string;
}

export function useListings(productId: string, variant: string) {
    const [listings, setListings] = useState<Listing[]>([]);
    const [filters, setFilters] = useState<ListingsFilters>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                productId,
                variant,
                ...Object.fromEntries(
                    Object.entries(filters).map(([key, value]) => [
                        key,
                        typeof value === 'object' ? JSON.stringify(value) : String(value)
                    ])
                )
            });

            const response = await listingsApi.listings(productId, queryParams);

            if (response.success && response.data) {
                setListings(response.data);
            } else {
                setError(response.message || 'Search failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [productId, variant, filters]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    const updateFilters = useCallback((newFilters: Partial<ListingsFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    return {
        listings,
        filters,
        loading,
        error,
        updateFilters,
        clearFilters,
        refetch: fetchListings
    };
}