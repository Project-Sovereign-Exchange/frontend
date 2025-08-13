export interface Variant {
    id: number;
    product_id: string;
    name: string;
    set_number?: string | null;
    is_primary: boolean;
    created_at: string;
}