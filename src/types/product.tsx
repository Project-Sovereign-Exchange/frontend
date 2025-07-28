export enum ProductCategory {
    CARD = 'card',
    SEALED = 'sealed',
    ACCESSORY = 'uncategorized'
}

export interface Product {
    id: string;
    name: string;
    image_url: string | null;
    game: string;
    expansion: string | null;
    set_number: string | null;
    category: ProductCategory;
    subcategory: string | null;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface CreateProductRequest {
    name: string;
    image_url?: string | null;
    game: string;
    expansion?: string | null;
    set_number?: string | null;
    category: ProductCategory;
    subcategory?: string | null;
    metadata?: Record<string, unknown>;
}

export interface UpdateProductRequest {
    id: string;
    name?: string;
    image_url?: string | null;
    game?: string;
    expansion?: string | null;
    set_number?: string | null;
    category?: ProductCategory;
    subcategory?: string | null;
    metadata?: Record<string, unknown>;
}

export interface ProductsResponse {
    data: Product[];
    pagination: {
        offset: number;
        limit: number;
        total: number;
        has_more: boolean;
    };
}

export interface ProductFilters {
    search?: string;
    game?: string;
    category?: ProductCategory;
    expansion?: string;
    offset?: number;
    limit?: number;
    sort?: 'name' | 'created_at' | 'updated_at';
    order?: 'asc' | 'desc';
}

export const getMetadataString = (metadata: Record<string, unknown>, key: string): string | null => {
    const value = metadata[key];
    return typeof value === 'string' ? value : null;
};