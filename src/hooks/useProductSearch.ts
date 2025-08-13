import { useState, useCallback } from 'react';
import { searchApi, SearchQuery, SearchResponse, SearchableProduct } from '@/lib/api/endpoints/search';

export const useProductSearch = () => {
    const [results, setResults] = useState<SearchResponse<SearchableProduct> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchProducts = useCallback(async (query: SearchQuery) => {
        if (!query.q.trim()) {
            setError('Search query cannot be empty');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchApi.products(query);

            if (response.success && response.data) {
                setResults(response.data);
            } else {
                setError(response.message || 'Search failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    return {
        results,
        loading,
        error,
        searchProducts,
        clearResults
    };
};