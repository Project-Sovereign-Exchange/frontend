import {apiClient, ApiResponse} from "@/lib/api/client";

export interface CreateListingRequest {
    product_id: string;
    price: number;
    condition: string;
    quantity: number;
    image_url?: string;
    description?: string;
}

export interface Listing {
    id: string,
    product_id: string,
    seller_id: string,
    price: number,
    condition: string,
    quantity: number,
    reserved_quantity: number,
    status: string,
    stripe_product_id: string,
    previous_stripe_product_id?: string,
    image_url?: string,
    description?: string,
    created_at: string,
    updated_at: string,
    deleted_at?: string,
}

export const listingsApi = {
    createListing: async (data: CreateListingRequest): Promise<ApiResponse<Listing>> => {
        return apiClient.post('/private/listings', data);
    },
    listings: async (productId: string, query: URLSearchParams): Promise<ApiResponse<Listing[]>> => {
        return apiClient.get(`/public/products/${productId}/listings`, query);
    }
}