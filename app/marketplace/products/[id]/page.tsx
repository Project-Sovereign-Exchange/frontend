import { ProductClientPage } from './ProductClientPage';
import {productsApi} from "@/lib/api/endpoints/products";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const productResponse = await productsApi.getProduct(id);
    const variantsResponse = await productsApi.getVariants(id);

    if (!productResponse.success || !variantsResponse.success || !productResponse.data || !variantsResponse.data) {
        return <div className="p-4 text-red-500">Product not found</div>;
    } else {
        return <ProductClientPage
            product={productResponse.data}
            variants={variantsResponse.data}
        />;
    }
}