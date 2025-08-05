import {API_BASE_URL, apiClient} from "@/lib/api/client";
import {Product} from "@/types/product";

export interface CreateProductRequest {
    name: string;
    game: string;
    category: string;
    expansion?: string;
    set_number?: string;
    subcategory?: string;
    metadata?: Record<string, unknown>;
}

export interface Variant {
    id: string;
    name: string;
    frontImage?: File | string;
    backImage?: File | string;
    isPrimary: boolean;
}

export interface ProductResponse {
    success: boolean;
    message: string;
    product: Product;
}

export const productsApi = {
    createProduct: async (data: CreateProductRequest): Promise<ProductResponse> => apiClient.post('/private/product', data),

    uploadProductImages: async (productId: string, variants: Variant[]): Promise<ProductResponse> => {
        const formData = new FormData();

        variants.forEach((variant) => {
            formData.append(`variant_${variant.id}_name`, variant.name);

            formData.append(`variant_${variant.id}_primary`, variant.isPrimary ? 'true' : 'false');

            if (variant.frontImage) {
                if (variant.frontImage instanceof File) {
                    formData.append(`variant_${variant.id}_front`, variant.frontImage);
                } else {
                    formData.append(`variant_${variant.id}_front_url`, variant.frontImage);
                }
            }

            if (variant.backImage) {
                if (variant.backImage instanceof File) {
                    formData.append(`variant_${variant.id}_back`, variant.backImage);
                } else {
                    formData.append(`variant_${variant.id}_back_url`, variant.backImage);
                }
            }
        });

        const response = await fetch(`${API_BASE_URL}/private/product/${productId}/images`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Failed to upload images: ${response.statusText}`);
        }

        return response.json();
    },

    createProductWithImages: async (data: CreateProductRequest, imageVariants: Variant[]): Promise<ProductResponse> => {
        try {
            const productData = {
                name: data.name,
                game: data.game,
                category: data.category,
                expansion: data.expansion,
                set_number: data.set_number,
                subcategory: data.subcategory,
                metadata: data.metadata,
            };

            const createdProduct = await productsApi.createProduct(productData);
            console.log('Product created:', createdProduct);

            const variantsWithImages = imageVariants.filter(
                v => v.frontImage || v.backImage
            );

            if (variantsWithImages.length > 0) {
                const uploadResult = await productsApi.uploadProductImages(
                    createdProduct.product.id,
                    variantsWithImages
                );
                console.log('Images uploaded:', uploadResult);
                return uploadResult;
            }

            return createdProduct;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }
}