import { IProduct } from "@/Interfaces/types";
import { addProduct } from "@/Redux/features/cart/cartSlice";
import { Brand } from "@/Redux/features/product/productApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: IProduct }) => {

    const dispatch = useDispatch();

    const addToCart = (product: IProduct) => {
        dispatch(addProduct(product));
        toast.success(`${product.name} added to Cart!`, {
            icon: "✅",
            duration: 2000,
        });
    };

    const discountPercentage = product.offerPrice && product.offerPrice > 0
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

    const isBrand = (brand: string | Brand | { name: string }): brand is Brand | { name: string } => {
        return typeof brand !== "string"; // It's either a Brand object or an inline object with 'name'
    };

    return (
        <div className="bg-white text-gray-800 border border-gray-300 shadow-lg p-4 rounded-xl hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group">
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden rounded-lg group-hover:scale-105 transition-all duration-300">
                <img
                    src={product.featuredImages}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-300"
                />
                {product.status === "featured" && (
                    <Badge className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs font-bold">
                        Featured
                    </Badge>
                )}
                {discountPercentage > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold">
                        {discountPercentage}% OFF
                    </Badge>
                )}
            </div>

            {/* Product Details */}
            <div className="mt-3 space-y-2 flex-grow">
                <Link to={`/product/${product._id}`}>
                    <h2 className="text-lg font-bold text-gray-800 hover:text-primary transition-colors duration-300">{product.name}</h2>
                </Link>

                <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">  {isBrand(product.brand) ? product.brand.name : product.brand} </p>
                    <p className="text-gray-500 text-sm">Quantity : {product.quantity}</p>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                        ৳ {Number(product.offerPrice) > 0 ? Number(product.offerPrice) : product.price}
                    </span>
                    {Number(product.offerPrice) > 0 && (
                        <span className="text-sm text-primary line-through">৳ {product.price}</span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-500 text-sm">{product.rating} Stars</span>
                </div>


            </div>

            {/* Add to Cart Button */}
            <div className="mt-4">
                <Button
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0 || !product.inStock}
                    className="w-full bg-primary-foreground text-white py-2 hover:bg-primary rounded-lg">
                    <ShoppingCart /> Add to Cart
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
