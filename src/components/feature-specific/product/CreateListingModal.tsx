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
import {Checkbox} from "@/components/ui/checkbox";

// Types
interface Product {
    id: string
    name: string
    category: string
}

// Mock data - replace with your actual product search API
// Categories: card, accessory, sealed
const MOCK_PRODUCTS: Product[] = [
    { id: "1", name: "Darth Vader", category: "card" },
    { id: "2", name: "Obi Wan", category: "card" },
    { id: "3", name: "Yoda", category: "card" },
    { id: "4", name: "Playmat", category: "accessory" },
    { id: "5", name: "Card Sleeves", category: "accessory" },
    { id: "6", name: "Deck Pod", category: "accessory" },
    { id: "7", name: "LOF Display Box", category: "sealed" },
    { id: "8", name: "SHD Display Box", category: "sealed" },
    { id: "9", name: "Pokemon Collectors Box", category: "sealed" },
]

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
    const [searchResults, setSearchResults] = React.useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
    const [showResults, setShowResults] = React.useState(false)

    const searchProducts = React.useCallback((query: string) => {
        if (!query.trim()) {
            setSearchResults([])
            return
        }

        const results = MOCK_PRODUCTS.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(results)
    }, [])

    React.useEffect(() => {
        const debounceTimer = setTimeout(() => {
            searchProducts(searchQuery)
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery, searchProducts])

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product)
        setSearchQuery(product.name)
        setShowResults(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProduct) {
            alert("Please select a product first")
            return
        }

        console.log("Submitting listing for:", selectedProduct)
    }

    return (
        <form className={cn("grid items-start gap-6", className)} onSubmit={handleSubmit}>
            {/* Product Search */}
            <div className="grid gap-3 relative">
                <Label htmlFor="product">Product</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="product"
                        type="text"
                        placeholder="Search for a product..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setShowResults(true)
                            if (!e.target.value) {
                                setSelectedProduct(null)
                            }
                        }}
                        onFocus={() => setShowResults(true)}
                        className="pl-10"
                    />
                    {selectedProduct && (
                        <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                </div>

                {/* Search Results */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                                onClick={() => handleProductSelect(product)}
                            >
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground capitalize">
                                    {product.category.replace('-', ' ')}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Category-specific form */}
            {selectedProduct && (
                <CategoryForm
                    category={selectedProduct.category}
                    productName={selectedProduct.name}
                />
            )}

            <Button type="submit" disabled={!selectedProduct}>
                Create Listing
            </Button>
        </form>
    )
}

interface CategoryFormProps {
    category: string
    productName: string
}

function CategoryForm({ category, productName }: CategoryFormProps) {
    switch (category) {
        case 'card':
            return <CardForm productName={productName} />
        case 'accessory':
            return <AccessoryForm productName={productName} />
        case 'sealed':
            return <SealedForm productName={productName} />
        default:
            return <GenericForm productName={productName} />
    }
}

function CardForm({ productName }: { productName: string }) {
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
            <div className="grid gap-3">
                <Label htmlFor="set">Set/Edition</Label>
                <Input id="set" placeholder="e.g., Base Set, Alpha, etc." />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="rarity">Rarity</Label>
                <Input id="rarity" placeholder="e.g., Rare, Holographic, etc." />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" />
            </div>
        </>
    )
}

function AccessoryForm({ productName }: { productName: string }) {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="condition">Condition</Label>
                <select id="condition" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="accessories">Description</Label>
                <Input id="accessories" placeholder="e.g., In box, from 2025" />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" />
            </div>
        </>
    )
}

function SealedForm({ productName }: { productName: string }) {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="condition">Sealed</Label>
                <Checkbox/>
                <span className="text-sm text-muted-foreground">
                    By checking this box, you confirm that the product is sealed and has not been opened.
                </span>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="accessories">Description</Label>
                <Input id="accessories" placeholder="e.g., " />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" />
            </div>
        </>
    )
}

function GenericForm({ productName }: { productName: string }) {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Describe the item..." />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" />
            </div>
        </>
    )
}