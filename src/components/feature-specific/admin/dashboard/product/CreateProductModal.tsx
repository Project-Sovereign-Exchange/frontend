"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
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
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useIsMobile} from "@/hooks/use-mobile"
import {Plus, Upload, X} from "lucide-react"
import {Checkbox} from "@/components/ui/checkbox"
import {ProductCategory} from "@/types/product"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

interface MetadataField {
    id: string
    key: string
    value: string
}

interface ImageVariant {
    id: string
    name: string
    front?: File | string
    back?: File | string
    frontPreview?: string
    backPreview?: string
}

interface ImageData {
    front?: string
    back?: string
}

interface ImageMetadata {
    [variantId: string]: ImageData
}

interface ProductMetadata {
    images?: ImageMetadata
    variants?: string[]
    primary_variant?: string
    variant_names?: Record<string, string>
    [key: string]: unknown
}

const PRODUCT_CATEGORIES = [
    { value: ProductCategory.CARD, label: "Card" },
    { value: ProductCategory.SEALED, label: "Sealed" },
    { value: ProductCategory.ACCESSORY, label: "Accessory" },
    { value: ProductCategory.OTHER, label: "Other" },
]

export function CreateProductModal(
    props: {
        onProductCreated?: (formData: FormData) => void
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
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
    onProductCreated?: (formData: FormData) => void
}) {
    const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory>(ProductCategory.OTHER)
    const [productName, setProductName] = React.useState("")
    const [game, setGame] = React.useState("")
    const [expansion, setExpansion] = React.useState("")
    const [setNumber, setSetNumber] = React.useState("")
    const [subcategory, setSubcategory] = React.useState("")
    const [metadataFields, setMetadataFields] = React.useState<MetadataField[]>([])

    const [imageVariants, setImageVariants] = React.useState<ImageVariant[]>([
        { id: 'default', name: 'Default' }
    ])
    const [primaryVariant, setPrimaryVariant] = React.useState('default')

    const addVariant = () => {
        const variantName = selectedCategory === ProductCategory.CARD
            ? `Print ${imageVariants.length}`
            : `Variant ${imageVariants.length}`

        const newVariant: ImageVariant = {
            id: Date.now().toString(),
            name: variantName
        }
        setImageVariants([...imageVariants, newVariant])
    }

    const removeVariant = (id: string) => {
        if (id === 'default') return // Can't remove default
        setImageVariants(imageVariants.filter(v => v.id !== id))
        if (primaryVariant === id) {
            setPrimaryVariant('default')
        }
    }

    const updateVariantName = (id: string, name: string) => {
        setImageVariants(imageVariants.map(v =>
            v.id === id ? { ...v, name } : v
        ))
    }

    const updateVariantImage = (
        variantId: string,
        face: 'front' | 'back',
        file?: File,
        url?: string
    ) => {
        setImageVariants(imageVariants.map(variant => {
            if (variant.id !== variantId) return variant

            const updated = { ...variant }

            if (file) {
                updated[face] = file
                updated[`${face}Preview`] = URL.createObjectURL(file)
                // Clear URL if file is provided
                if (face === 'front') updated.front = file
                if (face === 'back') updated.back = file
            } else if (url) {
                updated[face] = url
                updated[`${face}Preview`] = undefined
            }

            return updated
        }))
    }

    const removeVariantImage = (variantId: string, face: 'front' | 'back') => {
        setImageVariants(imageVariants.map(variant => {
            if (variant.id !== variantId) return variant

            const updated = { ...variant }
            updated[face] = undefined
            if (updated[`${face}Preview`]) {
                URL.revokeObjectURL(updated[`${face}Preview`]!)
                updated[`${face}Preview`] = undefined
            }

            return updated
        }))
    }

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

        const formElement = e.target as HTMLFormElement
        const formData = new FormData()

        formData.append('name', productName.trim())
        formData.append('game', game.trim())
        formData.append('category', selectedCategory)

        if (expansion.trim()) formData.append('expansion', expansion.trim())
        if (setNumber.trim()) formData.append('set_number', setNumber.trim())
        if (subcategory.trim()) formData.append('subcategory', subcategory.trim())

        metadataFields.forEach((field, index) => {
            if (field.key.trim() && field.value.trim()) {
                formData.append(`metadata_${index}_key`, field.key.trim())
                formData.append(`metadata_${index}_value`, field.value.trim())
            }
        })

        const categoryFormData = new FormData(formElement)
        for (const [key, value] of categoryFormData.entries()) {
            if (!['category', 'name', 'game', 'expansion', 'set_number', 'subcategory'].includes(key) &&
                !key.startsWith('metadata_') &&
                !key.startsWith('image_') &&
                !key.startsWith('variant_') &&
                value) {
                formData.append(key, value)
            }
        }

        imageVariants.forEach((variant) => {
            if (variant.front || variant.back || variant.name.trim()) {
                formData.append(`variant_${variant.id}_name`, variant.name.trim() || `Variant ${variant.id}`)
                formData.append(`variant_${variant.id}_is_primary`, (variant.id === primaryVariant).toString())

                if (variant.front) {
                    if (variant.front instanceof File) {
                        formData.append(`variant_${variant.id}_front_file`, variant.front)
                    } else if (typeof variant.front === 'string' && variant.front.trim()) {
                        formData.append(`variant_${variant.id}_front_url`, variant.front.trim())
                    }
                }

                if (variant.back) {
                    if (variant.back instanceof File) {
                        formData.append(`variant_${variant.id}_back_file`, variant.back)
                    } else if (typeof variant.back === 'string' && variant.back.trim()) {
                        formData.append(`variant_${variant.id}_back_url`, variant.back.trim())
                    }
                }
            }
        })
        onProductCreated?.(formData)
        onClose?.()
    }

    // Cleanup preview URLs on unmount
    React.useEffect(() => {
        return () => {
            imageVariants.forEach(variant => {
                if (variant.frontPreview) URL.revokeObjectURL(variant.frontPreview)
                if (variant.backPreview) URL.revokeObjectURL(variant.backPreview)
            })
        }
    }, [])

    return (
        <form className={cn("grid items-start gap-6", className)} onSubmit={handleSubmit}>
            {/* Basic Product Info */}
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

            {/* Images Section */}
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <Label>
                        {selectedCategory === ProductCategory.CARD ? 'Card Images & Prints' :
                            selectedCategory === ProductCategory.ACCESSORY ? 'Product Images & Variants' :
                                'Product Images'}
                    </Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVariant}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add {selectedCategory === ProductCategory.CARD ? 'Print' : 'Variant'}
                    </Button>
                </div>

                {/* Primary Variant Selector */}
                {imageVariants.length > 1 && (
                    <div className="grid gap-2">
                        <Label htmlFor="primary_variant">Primary {selectedCategory === ProductCategory.CARD ? 'Print' : 'Variant'}</Label>
                        <select
                            id="primary_variant"
                            value={primaryVariant}
                            onChange={(e) => setPrimaryVariant(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            {imageVariants.map(variant => (
                                <option key={variant.id} value={variant.id}>
                                    {variant.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <Tabs defaultValue={imageVariants[0]?.id} className="w-full">
                    <TabsList className="w-full flex flex-row items-center justify-between">
                        {imageVariants.map(variant => (
                            <TabsTrigger key={variant.id} value={variant.id}>
                                {variant.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {imageVariants.map(variant => (
                        <TabsContent key={variant.id} value={variant.id} className="space-y-4">
                            <VariantImageSection
                                variant={variant}
                                canDelete={variant.id !== 'default'}
                                selectedCategory={selectedCategory}
                                onUpdateName={(name) => updateVariantName(variant.id, name)}
                                onUpdateImage={(face, file, url) => updateVariantImage(variant.id, face, file, url)}
                                onRemoveImage={(face) => removeVariantImage(variant.id, face)}
                                onDelete={() => removeVariant(variant.id)}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Category-specific fields */}
            {selectedCategory && (
                <CategoryForm category={selectedCategory} />
            )}

            {/* Custom Metadata Fields */}
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

interface VariantImageSectionProps {
    variant: ImageVariant
    canDelete: boolean
    selectedCategory: ProductCategory
    onUpdateName: (name: string) => void
    onUpdateImage: (face: 'front' | 'back', file?: File, url?: string) => void
    onRemoveImage: (face: 'front' | 'back') => void
    onDelete: () => void
}

function VariantImageSection({
                                 variant,
                                 canDelete,
                                 selectedCategory,
                                 onUpdateName,
                                 onUpdateImage,
                                 onRemoveImage,
                                 onDelete
                             }: VariantImageSectionProps) {
    const frontFileRef = React.useRef<HTMLInputElement>(null)
    const backFileRef = React.useRef<HTMLInputElement>(null)

    const showBackImage = selectedCategory === ProductCategory.CARD

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            {/* Variant Name */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Variant name"
                    value={variant.name}
                    onChange={(e) => onUpdateName(e.target.value)}
                    className="flex-1"
                />
                {canDelete && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={onDelete}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Front Image */}
            <div className="space-y-2">
                {(variant.frontPreview || (typeof variant.front === 'string' && variant.front)) && (
                    <div className="relative w-32 h-32">
                        <img
                            src={variant.frontPreview || (typeof variant.front === 'string' ? variant.front : '')}
                            alt="Front preview"
                            className="w-full h-full object-cover rounded-md border"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => onRemoveImage('front')}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                <div className="flex gap-2">
                    <Input
                        ref={frontFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) onUpdateImage('front', file)
                        }}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => frontFileRef.current?.click()}
                    >
                        <Upload className="h-4 w-4" />
                    </Button>
                </div>

                <Input
                    placeholder="Or image URL"
                    value={typeof variant.front === 'string' ? variant.front : ''}
                    onChange={(e) => onUpdateImage('front', undefined, e.target.value)}
                />
            </div>

            {/* Back Image (only for cards) */}
            {showBackImage && (
                <div className="space-y-2">
                    <Label>Back Image</Label>
                    {(variant.backPreview || (typeof variant.back === 'string' && variant.back)) && (
                        <div className="relative w-32 h-32">
                            <img
                                src={variant.backPreview || (typeof variant.back === 'string' ? variant.back : '')}
                                alt="Back preview"
                                className="w-full h-full object-cover rounded-md border"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => onRemoveImage('back')}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Input
                            ref={backFileRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) onUpdateImage('back', file)
                            }}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => backFileRef.current?.click()}
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>

                    <Input
                        placeholder="Or image URL"
                        value={typeof variant.back === 'string' ? variant.back : ''}
                        onChange={(e) => onUpdateImage('back', undefined, e.target.value)}
                    />
                </div>
            )}
        </div>
    )
}

// Keep your existing CategoryForm component and its sub-components unchanged
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

        </>
    )
}

function AccessoryForm() {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    placeholder="e.g., In box, from 2025"
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
        </>
    )
}