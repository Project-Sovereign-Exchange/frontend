import {Product} from "@/types/product";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Pen} from "lucide-react";

export const ProductManagerList = (props: {
    products: Product[];
    onProductClick: (product: Product) => void;
}) => {
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    return (
        <div className="flex flex-col space-y-4">
            {props.products.map((product) => (
                <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                >
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-sm text-gray-600">{product.game}</p>
                        {product.expansion && (
                            <p className="text-xs text-gray-500">{product.expansion}</p>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        {hoveredProduct === product.id && (
                            <Button
                                onClick={() => props.onProductClick(product)}
                                className="px-3 py-1"
                                size="lg"
                            >
                                <Pen/>
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};