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
import { Plus, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductCategory, CreateProductRequest } from "@/types/product" // Adjust import path as needed

interface MetadataField {
    id: string
    key: string
    value: string
}

const PRODUCT_CATEGORIES = [
    { value: ProductCategory.CARD, label: "Card" },
    { value: ProductCategory.SEALED, label: "Sealed" },
    { value: ProductCategory.ACCESSORY, label: "Accessory" },
]

export function CreateProductModal(
    props: {
        onProductCreated?: (product: CreateProductRequest) => void
    }
) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = !useIsMobile()

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Create New</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Product</DialogTitle>
                        <DialogDescription>
                            Select a category and fill out the product details.
                        </DialogDescription>
                    </DialogHeader>
                    <ProductForm onClose={() => setOpen(false)} onProductCreated={props.onProductCreated} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>Create New</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Product</DrawerTitle>
                    <DrawerDescription>
                        Select a category and fill out the product details.
                    </DrawerDescription>
                </DrawerHeader>
                <ProductForm
                    className="px-4"
                    onClose={() => setOpen(false)}
                    onProductCreated={props.onProductCreated}
                />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ProductForm({
                         className,
                         onClose,
                         onProductCreated
                     }: React.ComponentProps<"form"> & {
    onClose?: () => void
    onProductCreated?: (product: CreateProductRequest) => void
}) {
    const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | "">("")
    const [productName, setProductName] = React.useState("")
    const [game, setGame] = React.useState("")
    const [expansion, setExpansion] = React.useState("")
    const [setNumber, setSetNumber] = React.useState("")
    const [subcategory, setSubcategory] = React.useState("")
    const [imageUrl, setImageUrl] = React.useState("")
    const [metadataFields, setMetadataFields] = React.useState<MetadataField[]>([])

    const addMetadataField = () => {
        if (metadataFields.length < 8) {
            const newField: MetadataField = {
                id: Date.now().toString(),
                key: "",
                value: ""
            }
            setMetadataFields([...metadataFields, newField])
        }
    }

    const removeMetadataField = (id: string) => {
        setMetadataFields(metadataFields.filter(field => field.id !== id))
    }

    const updateMetadataField = (id: string, key: string, value: string) => {
        setMetadataFields(metadataFields.map(field =>
            field.id === id ? { ...field, key, value } : field
        ))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedCategory || !productName.trim() || !game.trim()) {
            alert("Please fill in all required fields (category, name, and game)")
            return
        }

        const formData = new FormData(e.target as HTMLFormElement)
        const metadata: Record<string, unknown> = {}

        metadataFields.forEach(field => {
            if (field.key.trim() && field.value.trim()) {
                metadata[field.key.trim()] = field.value.trim()
            }
        })

        for (const [key, value] of formData.entries()) {
            if (!['category', 'name', 'game', 'expansion', 'set_number', 'subcategory', 'image_url'].includes(key) &&
                !key.startsWith('metadata_')) {
                if (value) {
                    metadata[key] = value
                }
            }
        }

        const productRequest: CreateProductRequest = {
            name: productName.trim(),
            game: game.trim(),
            category: selectedCategory as ProductCategory,
            expansion: expansion.trim() || null,
            set_number: setNumber.trim() || null,
            subcategory: subcategory.trim() || null,
            image_url: imageUrl.trim() || null,
            metadata: Object.keys(metadata).length > 0 ? metadata : undefined
        }

        console.log("Submitting product:", productRequest)
        onProductCreated?.(productRequest)
        onClose?.()
    }

    return (
        <form className={cn("grid items-start gap-6", className)} onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="grid gap-3">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter product name..."
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
            </div>

            {/* Game */}
            <div className="grid gap-3">
                <Label htmlFor="game">Game *</Label>
                <Input
                    id="game"
                    name="game"
                    type="text"
                    placeholder="e.g., Pokemon, Magic: The Gathering, Yu-Gi-Oh!"
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    required
                />
            </div>

            {/* Category Selection */}
            <div className="grid gap-3">
                <Label htmlFor="category">Category *</Label>
                <select
                    id="category"
                    name="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                >
                    <option value="">Select a category</option>
                    {PRODUCT_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Expansion */}
            <div className="grid gap-3">
                <Label htmlFor="expansion">Expansion/Set</Label>
                <Input
                    id="expansion"
                    name="expansion"
                    type="text"
                    placeholder="e.g., Base Set, Shadowlands, etc."
                    value={expansion}
                    onChange={(e) => setExpansion(e.target.value)}
                />
            </div>

            {/* Set Number (shown for cards) */}
            {selectedCategory === ProductCategory.CARD && (
                <div className="grid gap-3">
                    <Label htmlFor="set_number">Set Number</Label>
                    <Input
                        id="set_number"
                        name="set_number"
                        type="text"
                        placeholder="e.g., 001/200, PSY-1, etc."
                        value={setNumber}
                        onChange={(e) => setSetNumber(e.target.value)}
                    />
                </div>
            )}

            {/* Subcategory */}
            <div className="grid gap-3">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                    id="subcategory"
                    name="subcategory"
                    type="text"
                    placeholder="e.g., Holographic, Booster Pack, etc."
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                />
            </div>

            {/* Image URL */}
            <div className="grid gap-3">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>

            {/* Category-specific */}
            {selectedCategory && (
                <CategoryForm category={selectedCategory} />
            )}

            {/* Metadata Fields */}
            {metadataFields.length > 0 && (
                <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                        <Label>Custom Metadata Fields</Label>
                        <span className="text-sm text-muted-foreground">
                            {metadataFields.length}/8
                        </span>
                    </div>
                    <div className="space-y-3">
                        {metadataFields.map((field) => (
                            <div key={field.id} className="flex gap-2 items-center">
                                <Input
                                    placeholder="Field name"
                                    value={field.key}
                                    onChange={(e) => updateMetadataField(field.id, e.target.value, field.value)}
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Value"
                                    value={field.value}
                                    onChange={(e) => updateMetadataField(field.id, field.key, e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeMetadataField(field.id)}
                                    className="shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Field Button */}
            {metadataFields.length < 8 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={addMetadataField}
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Field ({metadataFields.length}/8)
                </Button>
            )}

            <Button type="submit" disabled={!selectedCategory || !productName.trim() || !game.trim()}>
                Create Product
            </Button>
        </form>
    )
}

interface CategoryFormProps {
    category: ProductCategory
}

function CategoryForm({ category }: CategoryFormProps) {
    switch (category) {
        case ProductCategory.CARD:
            return <CardForm />
        case ProductCategory.ACCESSORY:
            return <AccessoryForm />
        case ProductCategory.SEALED:
            return <SealedForm />
        default:
            return <GenericForm />
    }
}

function CardForm() {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="condition">Condition</Label>
                <select
                    id="condition"
                    name="condition"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
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
                <Label htmlFor="rarity">Rarity</Label>
                <Input
                    id="rarity"
                    name="rarity"
                    placeholder="e.g., Rare, Holographic, Secret Rare, etc."
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                />
            </div>
        </>
    )
}

function AccessoryForm() {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="condition">Condition</Label>
                <select
                    id="condition"
                    name="condition"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    placeholder="e.g., In box, from 2025"
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                />
            </div>
        </>
    )
}

function SealedForm() {
    const [isSealed, setIsSealed] = React.useState(false)

    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="sealed">Sealed Status</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="sealed"
                        checked={isSealed}
                        onCheckedChange={(checked) => setIsSealed(checked as boolean)}
                    />
                    <Label htmlFor="sealed" className="text-sm font-normal">
                        This product is sealed and has not been opened
                    </Label>
                </div>
                <input type="hidden" name="sealed" value={isSealed.toString()} />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    placeholder="e.g., Display box, booster pack..."
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                />
            </div>
        </>
    )
}

function GenericForm() {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    placeholder="Describe the item..."
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                />
            </div>
        </>
    )
}