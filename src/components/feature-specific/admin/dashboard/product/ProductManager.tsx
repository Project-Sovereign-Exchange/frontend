'use client';

import {CreateProductModal} from "@/components/feature-specific/admin/dashboard/product/CreateProductModal";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {ProductManagerList} from "@/components/feature-specific/admin/dashboard/product/ProductManagerList";
import {
    buildCustomMetadata,
    extractMetadataFromFormData, extractVariantOrderFromFormData, extractVariantsFromFormData,
    Product,
} from "@/types/product";
import {useState, useEffect, useCallback} from "react";
import {Button} from "@/components/ui/button";
import {apiClient} from "@/lib/api/client";
import {CreateProductRequest, productsApi} from "@/lib/api/endpoints/products";

interface ProductResponse {
    products: Product[];
    offset: number;
    limit: number;
    total: number;
    more: boolean;
}

async function fetchProducts(
    offset: number,
    limit: number,
    search?: string
): Promise<ProductResponse> {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await fetch(`http://localhost:3008/api/v1/public/product?offset=${offset}&limit=${limit}${searchParam}`, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
        }

        const data = await response.json();
        return data as ProductResponse;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const ProductManager = () => {
    // State management
    const [productData, setProductData] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentOffset, setCurrentOffset] = useState<number>(0);
    const limit = 6;

    const loadProducts = useCallback(async (offset: number = 0, search: string = '') => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProducts(offset, limit, search);
            setProductData(data);
            setCurrentOffset(offset);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
            setProductData(null);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        loadProducts(0, searchTerm);
    }, [loadProducts, searchTerm]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            loadProducts(0, searchTerm);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, loadProducts]);

    const handleProductClick = useCallback((product: Product) => {
        console.log('Product clicked:', product);
    }, []);

    const handleProductDelete = useCallback(async (productId: string) => {
        try {
            const response = await fetch(`http://localhost:3008/api/v1/admin/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await loadProducts(currentOffset, searchTerm);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }, [currentOffset, searchTerm, loadProducts]);

    const handleProductEdit = useCallback((product: Product) => {
        console.log('Edit product:', product);
    }, []);

    const handleProductCreated = useCallback(async (formData: FormData) => {
        try {
            const productData: CreateProductRequest = {
                name: formData.get('name') as string,
                description: formData.get('description') as string || undefined,
                category: formData.get('category') as string,
                subcategory: formData.get('subcategory') as string || undefined,
                game: formData.get('game') as string,
                set: formData.get('expansion') as string || undefined,
                base_image_url: undefined,
                variants: extractVariantsFromFormData(formData),
                metadata: buildCustomMetadata(extractMetadataFromFormData(formData))
            };

            const response = await productsApi.createProduct(productData);
            console.log('Product created:', response);

            if (!response.data?.variants || response.data.variants.length === 0) {
                console.log('No variants returned from product creation');
                return;
            }

            const createdProduct = response.data.product;
            const createdVariants = response.data.variants;

            const imageFormData = new FormData();
            let hasImages = false;

            const frontendVariants = extractVariantOrderFromFormData(formData);
            const variantIdMapping = new Map<string, number>();

            createdVariants.forEach((backendVariant: any, index: number) => {
                if (frontendVariants[index]) {
                    variantIdMapping.set(frontendVariants[index].frontendId, backendVariant.id);
                    console.log(`Mapping frontend variant ${frontendVariants[index].frontendId} to backend variant ${backendVariant.id}`);
                }
            });

            // Extract image data from form
            const variantEntries = Array.from(formData.entries())
                .filter(([key]) => key.startsWith('variant_'));

            const variantImageMap = new Map<string, any>();

            // Group variant data by frontend variant ID
            variantEntries.forEach(([key, value]) => {
                const parts = key.split('_');
                if (parts.length >= 3) {
                    const frontendVariantId = parts[1];
                    const fieldType = parts.slice(2).join('_');

                    if (!variantImageMap.has(frontendVariantId)) {
                        variantImageMap.set(frontendVariantId, {});
                    }

                    variantImageMap.get(frontendVariantId)[fieldType] = value;
                }
            });

            // Process each variant's images using real backend IDs
            variantImageMap.forEach((variantData, frontendVariantId) => {
                const backendVariantId = variantIdMapping.get(frontendVariantId);

                if (backendVariantId === undefined) {
                    console.warn(`No backend variant ID found for frontend ID: ${frontendVariantId}`);
                    return;
                }

                const variantName = variantData.name || `Variant ${backendVariantId}`;
                const isPrimary = variantData.primary === 'true';

                console.log(`Processing variant ${frontendVariantId} -> ${backendVariantId}:`, {
                    name: variantName,
                    isPrimary,
                    hasFront: !!(variantData.front instanceof File),
                    hasBack: !!(variantData.back instanceof File)
                });

                // Add variant metadata using real backend ID
                imageFormData.append(`variant_${backendVariantId}_name`, variantName);
                imageFormData.append(`variant_${backendVariantId}_primary`, isPrimary.toString());

                // Add front image if exists
                if (variantData.front && variantData.front instanceof File) {
                    imageFormData.append(`variant_${backendVariantId}_front`, variantData.front);
                    hasImages = true;
                    console.log(`Added front image for variant ${backendVariantId}`);
                }

                // Add back image if exists
                if (variantData.back && variantData.back instanceof File) {
                    imageFormData.append(`variant_${backendVariantId}_back`, variantData.back);
                    hasImages = true;
                    console.log(`Added back image for variant ${backendVariantId}`);
                }
            });

            // Upload images if any exist
            if (hasImages && createdProduct?.id) {
                console.log(`Uploading images for product ${createdProduct.id}...`);

                // Debug: Log all FormData entries
                console.log('FormData entries for image upload:');
                for (const [key, value] of imageFormData.entries()) {
                    console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
                }

                const imageResult = await productsApi.uploadProductImages(createdProduct.id, imageFormData);
                console.log('Images uploaded:', imageResult);
            } else {
                console.log('No images to upload');
            }

            console.log('Complete product created with images');

        } catch (error) {
            console.error('Failed to create product:', error);
            alert(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        loadProducts(currentOffset, searchTerm);
    }, [currentOffset, searchTerm, loadProducts]);

    // Pagination handlers
    const handleNextPage = useCallback(() => {
        if (productData?.more) {
            loadProducts(currentOffset + limit, searchTerm);
        }
    }, [productData?.more, currentOffset, limit, searchTerm, loadProducts]);

    const handlePreviousPage = useCallback(() => {
        if (currentOffset > 0) {
            loadProducts(Math.max(0, currentOffset - limit), searchTerm);
        }
    }, [currentOffset, limit, searchTerm, loadProducts]);

    return (
        <div className="flex flex-col justify-start min-h-screen p-6 md:p-10">
            <div className="flex flex-row justify-between p-6 md:p-10">
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                    Products
                </h1>
            </div>

            <div className="flex flex-row justify-between px-6 md:px-10 mb-6">
                <div className="relative w-full max-w-md">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={20} />
                    </span>
                    <Input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <CreateProductModal onProductCreated={handleProductCreated} />
            </div>

            {error && (
                <div className="px-6 md:px-10 mb-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            )}

            {loading && (
                <div className="px-6 md:px-10">
                    <div className="text-center py-8">Loading products...</div>
                </div>
            )}

            {!loading && productData && (
                <div className="px-6 md:px-10">
                    <ProductManagerList
                        products={productData.products}
                        onProductClick={handleProductClick}
                    />

                    <div className="flex justify-between items-center mt-6">
                        <Button
                            onClick={handlePreviousPage}
                            disabled={currentOffset === 0}
                            className="px-4 py-2"
                        >
                            Previous
                        </Button>

                        <span className="text-sm text-gray-600">
                            Showing {currentOffset + 1} - {Math.min(currentOffset + limit, productData.total)} of {productData.total}
                        </span>

                        <Button
                            onClick={handleNextPage}
                            disabled={!productData.more}
                            className="px-4 py-2"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}