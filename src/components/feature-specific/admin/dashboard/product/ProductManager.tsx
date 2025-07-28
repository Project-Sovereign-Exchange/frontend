'use client';

import {CreateProductModal} from "@/components/feature-specific/admin/dashboard/product/CreateProductModal";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {ProductManagerList} from "@/components/feature-specific/admin/dashboard/product/ProductManagerList";
import {Product} from "@/types/product";
import {useState, useEffect, useCallback} from "react";
import {Button} from "@/components/ui/button";

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

    const handleProductCreated = useCallback(() => {
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