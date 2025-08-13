"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIsMobile } from "@/hooks/use-mobile"
import { Search, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useProductSearch } from '@/hooks/useProductSearch'
import { SearchableProduct, SearchQuery } from '@/lib/api/endpoints/search'

export function CreateListingModal() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = !useIsMobile()

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Sell</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create Listing</DialogTitle>
                        <DialogDescription>
                            Search for a product and fill out the listing details.
                        </DialogDescription>
                    </DialogHeader>
                    <ListingForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>Sell</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Listing</DrawerTitle>
                    <DrawerDescription>
                        Search for a product and fill out the listing details.
                    </DrawerDescription>
                </DrawerHeader>
                <ListingForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ListingForm({ className }: React.ComponentProps<"form">) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [debouncedQuery, setDebouncedQuery] = React.useState("")
    const [selectedProduct, setSelectedProduct] = React.useState<SearchableProduct | null>(null)
    const [showResults, setShowResults] = React.useState(false)
    const [isSearching, setIsSearching] = React.useState(false)
    const debounceTimeoutRef = React.useRef<NodeJS.Timeout>()

    const { results, loading, error, searchProducts } = useProductSearch()

    // Debounced search logic
    React.useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        if (searchQuery.length >= 2) {
            setIsSearching(true)
            debounceTimeoutRef.current = setTimeout(() => {
                setDebouncedQuery(searchQuery)
            }, 300)
        } else {
            setDebouncedQuery('')
            setIsSearching(false)
            setShowResults(false)
        }

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [searchQuery])

    // Search when debounced query changes
    React.useEffect(() => {
        if (debouncedQuery.length >= 2) {
            const searchQueryObj: SearchQuery = {
                q: debouncedQuery,
                limit: 10 // Show more results for listing creation
            }
            searchProducts(searchQueryObj)
            setShowResults(true)
            setIsSearching(false)
        }
    }, [debouncedQuery, searchProducts])

    // Show results when query is long enough
    React.useEffect(() => {
        if (searchQuery.length >= 2) {
            setShowResults(true)
        } else {
            setShowResults(false)
        }
    }, [searchQuery])

    const handleProductSelect = React.useCallback((product: SearchableProduct) => {
        setSelectedProduct(product)
        setSearchQuery(product.name)
        setShowResults(false)
    }, [])

    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value
        setSearchQuery(newQuery)

        if (!newQuery) {
            setSelectedProduct(null)
        }

        if (newQuery.length >= 2) {
            setShowResults(true)
        }
    }, [])

    const handleInputFocus = React.useCallback(() => {
        if (searchQuery.length >= 2) {
            setShowResults(true)
        }
    }, [searchQuery])

    // Handle clicking outside to close dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element
            if (!target.closest('.search-container')) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProduct) {
            alert("Please select a product first")
            return
        }

        console.log("Submitting listing for:", selectedProduct)
    }

    // Memoized search result item
    const SearchResultItem = React.memo(({ product, onClick }: {
        product: SearchableProduct
        onClick: (product: SearchableProduct) => void
    }) => (
        <button
            type="button"
            className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
            onClick={() => onClick(product)}
        >
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">
                {product.game}{product.set && ` • ${product.set}`}
            </div>
        </button>
    ))

    SearchResultItem.displayName = 'SearchResultItem'

    const renderSearchResults = () => {
        if (!showResults) return null

        const shouldShowLoading = (loading || isSearching) && (!results || results.hits.length === 0)

        return (
            <div className="absolute top-full left-0 right-0 z-50 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto border-t-0">
                {shouldShowLoading && (
                    <div className="p-4 text-center text-muted-foreground">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground"></div>
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
                        {results.hits.length > 0 ? (
                            results.hits.map((product) => (
                                <SearchResultItem
                                    key={product.id}
                                    product={product}
                                    onClick={handleProductSelect}
                                />
                            ))
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">
                                <div className="mb-2">No products found for "{searchQuery}"</div>
                                <div className="text-sm">Try searching with different keywords</div>
                            </div>
                        )}
                    </>
                )}
            </div>
        )
    }

    return (
        <form className={cn("grid items-start gap-6", className)} onSubmit={handleSubmit}>
            {/* Product Search */}
            <div className="grid gap-3 relative search-container">
                <Label htmlFor="product">Product</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="product"
                        type="text"
                        placeholder="Search for a product..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className={`pl-10 ${showResults ? 'rounded-b-none' : ''}`}
                        autoComplete="off"
                    />
                    {selectedProduct && (
                        <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                </div>

                {renderSearchResults()}
            </div>

            {/* Category-specific form */}
            {selectedProduct && (
                <CategoryForm
                    product={selectedProduct}
                />
            )}

            <Button type="submit" disabled={!selectedProduct}>
                Create Listing
            </Button>
        </form>
    )
}

interface CategoryFormProps {
    product: SearchableProduct
}

function CategoryForm({ product }: CategoryFormProps) {
    // You can determine category based on product.game or other properties
    // For now, I'll create a generic form that works with the SearchableProduct type
    return <GenericForm product={product} />
}

function GenericForm({ product }: { product: SearchableProduct }) {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="condition">Condition</Label>
                <select id="condition" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select condition</option>
                    <option value="mint">Mint</option>
                    <option value="near-mint">Near Mint</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="played">Played</option>
                    <option value="poor">Poor</option>
                </select>
            </div>
            {product.set && (
                <div className="grid gap-3">
                    <Label htmlFor="set">Set/Edition</Label>
                    <Input id="set" defaultValue={product.set} />
                </div>
            )}
            <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Additional details about the item..." />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" />
            </div>
        </>
    )
}