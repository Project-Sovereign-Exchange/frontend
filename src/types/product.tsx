import {Variant} from "@/lib/api/endpoints/products";


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

export const extractImageVariantsFromFormData = (formData: FormData): Variant[] => {
    const variants: Record<string, Partial<Variant>> = {};
    const entries = Array.from(formData.entries());

    entries.forEach(([key, value]) => {
        if (key.startsWith('variant_')) {
            const parts = key.split('_');
            if (parts.length >= 3) {
                const variantId = parts[1];
                const fieldType = parts.slice(2).join('_');

                if (!variants[variantId]) {
                    variants[variantId] = {
                        id: variantId,
                        name: '',
                        frontImage: undefined,
                        backImage: undefined,
                        isPrimary: false
                    };
                }

                switch (fieldType) {
                    case 'name':
                        variants[variantId].name = value as string;
                        break;
                    case 'is_primary':
                        variants[variantId].isPrimary = value === 'true';
                        break;
                    case 'front_file':
                        variants[variantId].frontImage = value as File;
                        break;
                    case 'front_url':
                        if (value && typeof value === 'string' && value.trim()) {
                            variants[variantId].frontImage = value as string;
                        }
                        break;
                    case 'back_file':
                        variants[variantId].backImage = value as File;
                        break;
                    case 'back_url':
                        if (value && typeof value === 'string' && value.trim()) {
                            variants[variantId].backImage = value as string;
                        }
                        break;
                }
            }
        }
    });

    return Object.values(variants)
        .filter((variant): variant is Variant =>
            Boolean(variant.id && variant.name && (variant.frontImage || variant.backImage))
        );
};