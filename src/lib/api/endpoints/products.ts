import {API_BASE_URL, apiClient, ApiResponse} from "@/lib/api/client";
import {CreateProductResponse, Product} from "@/types/product";
import {Variant} from "@/types/variant";

export interface CreateVariantRequest {
    name: string;
    set_number?: string;
    is_primary: boolean;
    metadata?: any;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    category: string;
    subcategory?: string;
    game: string;
    set?: string;
    base_image_url?: string;
    variants: CreateVariantRequest[];
    metadata?: any;
}

export interface ImageVariant {
    id: string;
    name: string;
    set_number?: string;
    frontImage?: File | string;
    backImage?: File | string;
    isPrimary: boolean;
}

export interface ProductResponse {
    success: boolean;
    message: string;
    product: Product;
}

export interface ImageUploadResponse {
    success: boolean;
    message: string;
}

export interface ProductsListResponse {
    products: Product[];
    offset: number;
    limit: number;
    total: number;
    more: boolean;
}

export const productsApi = {
    createProduct: async (data: CreateProductRequest): Promise<ApiResponse<CreateProductResponse>> => {
        return apiClient.post('/private/product', data);
    },

    uploadProductImages: async (productId: string, formData: FormData): Promise<ImageUploadResponse> => {
        const response = await fetch(`${API_BASE_URL}/private/product/${productId}/images`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload images: ${response.statusText} - ${errorText}`);
        }

        return response.json();
    },

    createProductVariants: async (productId: string, variants: CreateVariantRequest[]): Promise<any> => {
        return apiClient.post(`/private/product/${productId}/variants`, variants);
    },

    getProduct: async (productId: string): Promise<ApiResponse<Product>> => {
        return apiClient.get(`/public/product/${productId}`);
    },

    getVariants: async (productId: string): Promise<ApiResponse<Variant[]>> => {
        return apiClient.get(`/public/product/${productId}/variants`);
    },

    getProducts: async (offset: number = 0, limit: number = 10): Promise<ProductsListResponse> => {
        return apiClient.get(`/private/product?offset=${offset}&limit=${limit}`);
    },

    getProductCount: async (): Promise<number> => {
        return apiClient.get('/private/product/count');
    },

    deleteProduct: async (productId: string): Promise<void> => {
        return apiClient.delete(`/private/product/${productId}`);
    },
};