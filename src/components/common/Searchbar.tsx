"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductSearch } from '@/hooks/useProductSearch';
import { SearchableProduct, SearchQuery } from '@/lib/api/endpoints/search';
import Image from 'next/image';
import {buildProductImageUrlWithSize} from "@/util/images";

const imageCache = new Map<string, boolean>();

const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (imageCache.has(src)) {
            resolve();
            return;
        }

        const img = new window.Image();
        img.onload = () => {
            imageCache.set(src, true);
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    });
};

export const Searchbar = React.memo(() => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const debounceTimeoutRef = useRef<NodeJS.Timeout>();

    const { results, loading, error, searchProducts } = useProductSearch();

    const groupedProducts = useMemo(() => {
        if (!results?.hits) return {};

        const grouped = results.hits.reduce((acc, product) => {
            const category = product.category || product.game || 'Other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as Record<string, SearchableProduct[]>);

        const sortedCategories = Object.keys(grouped).sort();
        const sortedGrouped: Record<string, SearchableProduct[]> = {};
        sortedCategories.forEach(cat => {
            sortedGrouped[cat] = grouped[cat];
        });

        return sortedGrouped;
    }, [results]);

    const totalItems = useMemo(() => {
        return Object.values(groupedProducts).reduce((total, products) => total + products.length, 0);
    }, [groupedProducts]);

    useEffect(() => {
        if (results?.hits) {
            const newLoadedImages = new Set(loadedImages);

            results.hits.forEach(async (product) => {
                const imageUrl = buildProductImageUrlWithSize(
                    product.game,
                    product.id,
                    'Default',
                    'front',
                    'thumbnail'
                ) || '/images/product/default.png';

                if (!loadedImages.has(imageUrl)) {
                    try {
                        await preloadImage(imageUrl);
                        newLoadedImages.add(imageUrl);
                        setLoadedImages(new Set(newLoadedImages));
                    } catch (error) {
                        console.warn('Failed to preload image:', imageUrl);
                    }
                }
            });
        }
    }, [results, loadedImages]);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (query.length >= 2) {
            setIsSearching(true);
            debounceTimeoutRef.current = setTimeout(() => {
                setDebouncedQuery(query);
            }, 300);
        } else {
            setDebouncedQuery('');
            setIsSearching(false);
            setShowResults(false);
        }

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [query]);

    const searchQuery = useMemo((): SearchQuery => ({
        q: debouncedQuery,
        limit: 5,
        ...(category && category !== 'all' && { game: category })
    }), [debouncedQuery, category]);

    useEffect(() => {
        if (debouncedQuery.length >= 2) {
            searchProducts(searchQuery);
            setShowResults(true);
            setIsSearching(false);
        }
    }, [searchQuery, searchProducts, debouncedQuery]);

    useEffect(() => {
        if (query.length >= 2) {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [query]);

    const getProductByIndex = useCallback((index: number): SearchableProduct | null => {
        let currentIndex = 0;
        for (const products of Object.values(groupedProducts)) {
            if (index < currentIndex + products.length) {
                return products[index - currentIndex];
            }
            currentIndex += products.length;
        }
        return null;
    }, [groupedProducts]);

    const handleProductClick = useCallback((product: SearchableProduct) => {
        router.push(`/marketplace/products/${product.id}`);
        setShowResults(false);
        setQuery('');
        setDebouncedQuery('');
        setSelectedIndex(-1);
    }, [router]);

    const handleSearch = useCallback(() => {
        if (query.trim()) {
            const searchParams = new URLSearchParams({
                q: query,
                ...(category && category !== 'all' && { game: category })
            });
            router.push(`/marketplace/products?${searchParams.toString()}`);
            setShowResults(false);
            setQuery('');
            setDebouncedQuery('');
        }
    }, [query, category, router]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setSelectedIndex(-1);

        if (newQuery.length >= 2) {
            setShowResults(true);
        }
    }, []);

    const handleInputFocus = useCallback(() => {
        if (query.length >= 2) {
            setShowResults(true);
        }
    }, [query]);

    const handleCategoryChange = useCallback((value: string) => {
        setCategory(value);
        setSelectedIndex(-1);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showResults || totalItems === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => prev < totalItems - 1 ? prev + 1 : prev);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0) {
                        const product = getProductByIndex(selectedIndex);
                        if (product) {
                            handleProductClick(product);
                        }
                    } else {
                        handleSearch();
                    }
                    break;
                case 'Escape':
                    setShowResults(false);
                    setSelectedIndex(-1);
                    inputRef.current?.blur();
                    break;
            }
        };

        if (showResults) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [showResults, totalItems, selectedIndex, handleProductClick, handleSearch, getProductByIndex]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const SearchResultItem = React.memo(({ product, globalIndex, isSelected, onClick }: {
        product: SearchableProduct;
        globalIndex: number;
        isSelected: boolean;
        onClick: (product: SearchableProduct) => void;
    }) => {
        const imageUrl = useMemo(() =>
                buildProductImageUrlWithSize(
                    product.game,
                    product.id,
                    'Default',
                    'front',
                    'thumbnail'
                ) || '/images/product/default.png',
            [product.game, product.id]
        );

        return (
            <div
                onClick={() => onClick(product)}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50' : ''
                }`}
            >
                <div className="flex flex-row">
                    <div className="flex-shrink-0">
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-md inline-block mr-3"
                            priority={globalIndex < 3}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7nxa09rI7A4gNCqhbiaGd5HjU+FZv7JJkjy9iLr20mYUZn5jl/1l1g1BYKCnLLdJP7qKtJr2ddUQhXd0YaF6VHuO1l0qGxhXBQC4aQ7hddAjYCHB/k1bNGgJJHqJJJHqJJJA"
                            unoptimized={false}
                            style={{
                                objectFit: 'cover',
                                backgroundColor: '#f3f4f6'
                            }}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate">
                            {product.game}{product.set && ` • ${product.set}`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }, (prevProps, nextProps) => {
        return (
            prevProps.product.id === nextProps.product.id &&
            prevProps.isSelected === nextProps.isSelected &&
            prevProps.globalIndex === nextProps.globalIndex
        );
    });

    SearchResultItem.displayName = 'SearchResultItem';

    const renderSearchResults = () => {
        if (!showResults) return null;

        const shouldShowLoading = (loading || isSearching) && (!results || results.hits.length === 0);

        return (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-96 overflow-y-auto z-50 border-t-0">
                {shouldShowLoading && (
                    <div className="p-4 text-center text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span>Searching products...</span>
                        </div>
                    </div>
                )}

                {error && !shouldShowLoading && (
                    <div className="p-4 text-center text-red-500">
                        {error}
                    </div>
                )}

                {results && !shouldShowLoading && (
                    <>
                        {totalItems > 0 ? (
                            <>
                                {Object.entries(groupedProducts).map(([categoryName, products]) => {
                                    let startingIndex = 0;
                                    for (const [prevCategoryName, prevProducts] of Object.entries(groupedProducts)) {
                                        if (prevCategoryName === categoryName) break;
                                        startingIndex += prevProducts.length;
                                    }

                                    return (
                                        <div key={categoryName}>
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-50 border-b">
                                                {categoryName.toUpperCase()}
                                            </div>
                                            {products.map((product, index) => (
                                                <SearchResultItem
                                                    key={product.id}
                                                    product={product}
                                                    globalIndex={startingIndex + index}
                                                    isSelected={selectedIndex === startingIndex + index}
                                                    onClick={handleProductClick}
                                                />
                                            ))}
                                        </div>
                                    );
                                })}
                                <div className="px-4 py-3 border-t bg-gray-50">
                                    <button
                                        onClick={handleSearch}
                                        className="text-primary hover:underline cursor-pointer text-sm font-medium transition-colors duration-150"
                                    >
                                        View all results for {query} →
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                <div className="text-gray-400 mb-2">No products found for {query}</div>
                                <button
                                    onClick={handleSearch}
                                    className="text-primary hover:underline cursor-pointer text-sm transition-colors duration-150"
                                >
                                    Search all results →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <div ref={searchRef} className="relative flex items-center w-full max-w-md">
            <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="rounded-r-none bg-primary-foreground text-primary w-full max-w-1/4">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Games</SelectItem>
                    <SelectItem value="Pokemon">Pokémon</SelectItem>
                    <SelectItem value="Magic">Magic: The Gathering</SelectItem>
                    <SelectItem value="Star Wars Unlimited">Star Wars Unlimited</SelectItem>
                </SelectContent>
            </Select>

            <Input
                ref={inputRef}
                type="search"
                placeholder="Search products..."
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={`flex-grow bg-primary-foreground text-primary rounded-none transition-all duration-150 ${
                    showResults ? 'rounded-b-none' : ''
                }`}
                autoComplete="off"
            />

            <Button onClick={handleSearch} className={`rounded-l-none transition-all duration-150 ${
                showResults ? 'rounded-br-none' : ''
            }`}>
                <Search className="h-4 w-4" />
            </Button>

            {renderSearchResults()}
        </div>
    );
});

Searchbar.displayName = 'Searchbar';