import {productsApi} from "@/lib/api/endpoints/products";
import {Variant} from "./variant";
import {useEffect, useState} from "react";


export enum ProductCategory {
    CARD = 'card',
    SEALED = 'sealed',
    ACCESSORY = 'accessory',
    OTHER = 'other',
}

export interface Product {
    id: string;
    name: string;
    image_url: string | null;
    game: string;
    set: string | null;
    set_number: string | null;
    category: ProductCategory;
    subcategory: string | null;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface CreateProductResponse {
    product: Product;
    variants: Variant[];
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    image_url?: string | null;
    game: string;
    expansion?: string | null;
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

export interface CreateVariantRequest {
    name: string;
    set_number?: string;
    is_primary: boolean;
    metadata?: Record<string, unknown> | null;
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

export interface MetadataField {
    id: string;
    key: string;
    value: string;
}

export const getMetadataString = (metadata: Record<string, unknown>, key: string): string | null => {
    const value = metadata[key];
    return typeof value === 'string' ? value : null;
};

export const buildCustomMetadata = (metadataFields: MetadataField[]) => {
    const metadata: Record<string, any> = {};
    metadataFields.forEach(field => {
        if (field.key.trim() && field.value.trim()) {
            metadata[field.key.trim()] = field.value.trim();
        }
    });
    return metadata;
};

export const extractMetadataFromFormData = (formData: FormData): MetadataField[] => {
    const metadataFields: MetadataField[] = [];
    const entries = Array.from(formData.entries());

    entries.forEach(([key, value]) => {
        if (key.startsWith('metadata_') && key.endsWith('_key')) {
            const index = key.split('_')[1];
            const keyValue = value as string;
            const valueKey = `metadata_${index}_value`;
            const fieldValue = formData.get(valueKey) as string;

            if (keyValue && fieldValue) {
                metadataFields.push({
                    id: index,
                    key: keyValue,
                    value: fieldValue
                });
            }
        }
    });

    return metadataFields;
};

export function extractVariantOrderFromFormData(formData: FormData): Array<{frontendId: string, order: number}> {
    const variants: Array<{frontendId: string, order: number}> = [];

    // Get all variant names to determine order
    Array.from(formData.entries())
        .filter(([key]) => key.startsWith('variant_') && key.endsWith('_name'))
        .forEach(([key]) => {
            const frontendId = key.split('_')[1];
            variants.push({
                frontendId,
                order: variants.length
            });
        });

    // Sort by the order they appear in the form
    return variants.sort((a, b) => a.order - b.order);
}

// Updated helper function to extract variants from form data
export function extractVariantsFromFormData(formData: FormData): CreateVariantRequest[] {
    const variants: CreateVariantRequest[] = [];
    const variantMap = new Map<string, any>();

    // Group variant data by frontend variant ID
    Array.from(formData.entries())
        .filter(([key]) => key.startsWith('variant_'))
        .forEach(([key, value]) => {
            const parts = key.split('_');
            if (parts.length >= 3) {
                const variantId = parts[1];
                const fieldType = parts.slice(2).join('_');

                // Skip image fields for variant creation
                if (fieldType === 'front' || fieldType === 'back') {
                    return;
                }

                if (!variantMap.has(variantId)) {
                    variantMap.set(variantId, {});
                }

                variantMap.get(variantId)[fieldType] = value;
            }
        });

    // Convert to CreateVariantRequest format, maintaining order
    const orderedVariants = Array.from(variantMap.entries())
        .sort(([a], [b]) => parseInt(a) - parseInt(b)); // Sort by frontend ID

    orderedVariants.forEach(([variantId, variantData]) => {
        variants.push({
            name: variantData.name || `Variant ${variantId}`,
            set_number: variantData.set_number || undefined,
            is_primary: variantData.primary === 'true',
            metadata: null
        });
    });

    // Ensure at least one variant exists
    if (variants.length === 0) {
        variants.push({
            name: 'Default',
            set_number: undefined,
            is_primary: true,
            metadata: null
        });
    }

    return variants;
}

export const useProduct = (productId: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await productsApi.getProduct(productId);

                if (response.success) {
                    setProduct(response.data as Product);
                } else {
                    setError(response.message);
                    setProduct(null);
                }
            } catch (err) {
                setError(err.message);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, loading, error };
};