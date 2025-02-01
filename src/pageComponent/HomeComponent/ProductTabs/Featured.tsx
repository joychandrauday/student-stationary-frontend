import { Marquee } from "@/components/ui/marquee";
import { IProduct, IUser, useAllProductssQuery } from "@/Interfaces/types";
import { useCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/features/hook";
import { useGetProductsQuery, useUpdateProductMutation } from "@/Redux/features/product/productApi";
import { useUpdateUserMutation } from "@/Redux/features/user/userApi";
import addToCart from "@/Utils/addToCard";
import useUser from "@/Utils/useUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Featured = () => {
    const navigate = useNavigate();
    const [updateProduct] = useUpdateProductMutation()
    const [updateUser] = useUpdateUserMutation()
    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email) as { user: IUser | null; isLoading: boolean; error: unknown };


    // State for quantity per product
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    // Handle quantity change for products in the cart
    const handleQuantityChange = (productId: string, value: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Number(value),
        }));
    };


    const { data: products = [], refetch } = useGetProductsQuery<useAllProductssQuery>({});

    const productF = products.filter((product) => product.status === 'featured');
    const handleAddToCart = (product: IProduct) => {
        addToCart(product, user, updateProduct, updateUser, refetch);
    };

    return (
        <div className="">
            <div className="relative flex container mx-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent group">
                <Marquee pauseOnHover className="[--duration:20s]">
                    {productF.map((product) => (
                        <div key={product._id} className="bg-white p-4 rounded-none shadow-md relative">
                            <img src={product.featuredImages} alt={product.name} className="w-full h-40 object-cover mb-4" />

                            <div className="absolute top-2 right-2 bg-primary rounded-full px-2 text-sm">
                                Only {product.quantity} piece left
                            </div>

                            <h2 className="text-lg font-medium text-gray-800">{product.name}</h2>

                            {/* Show Discounted Price if Available */}
                            <p className="text-gray-600">
                                {product.discount ? (
                                    <>
                                        <span className="line-through text-red-500">৳{product.price}</span>
                                        <span className="text-green-600 font-bold ml-2">৳{(product.price - (product.price * product.discount / 100)).toFixed(2)}</span>
                                    </>
                                ) : (
                                    <span>৳{product.price}</span>
                                )}
                            </p>

                            <p className="text-yellow-500 font-medium">Rating: {product.rating} ⭐</p>
                            <p className="text-gray-500 text-sm">Stock: {product.inStock ? "In Stock" : "Out of Stock"}</p>

                            <input
                                type="number"
                                min="1"
                                max={product.quantity}
                                value={quantities[product._id] ?? 1}
                                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                className="mt-1 w-full p-2 border rounded bg-primary-foreground"
                            />

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className={!product.inStock || product.quantity === 0 || !user ? "cursor-not-allowed w-full bg-gray-500 text-white py-2 hover:bg-primary" : "w-full bg-primary-foreground text-white py-2 hover:bg-primary"}
                                    disabled={!product.inStock || product.quantity === 0 || !user}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="w-full bg-gray-300 text-gray-700 py-2 hover:bg-gray-400"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export default Featured;
