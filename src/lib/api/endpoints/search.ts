import {apiClient, ApiResponse} from "@/lib/api/client";

export interface SearchQuery {
    q: string;
    limit?: number;
    offset?: number;
    game?: string;
    set?: string;
    condition?: string;
    min_price?: number;
    max_price?: number;
    sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
}

export interface SearchResponse<T> {
    hits: T[];
    query: string;
    processing_time_ms: number;
    hitsCount: number;
    offset: number;
    limit: number;
    estimated_total_hits?: number;
}

export interface SearchableProduct {
    id: string;
    name: string;
    game?: string;
    set?: string;
    category: string;
    subcategory?: string;
    metadata?: Record<string, unknown>;
}

export interface SearchableListing {
    id: string;
    product_name: string;
    price: number;
    condition: string;
    game?: string;
    set?: string;
}

export const searchApi = {
    products: async (query: SearchQuery): Promise<ApiResponse<SearchResponse<SearchableProduct>>> => {
        return apiClient.get(`/public/search/products`, query);
    },

    listings: async (query: SearchQuery): Promise<ApiResponse<SearchResponse<SearchableListing>>> => {
        return apiClient.get(`/public/search/listings`, query);
    }
}