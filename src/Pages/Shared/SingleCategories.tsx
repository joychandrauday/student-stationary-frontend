
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductsQuery, useUpdateProductMutation } from '@/Redux/features/product/productApi';
import { useUpdateUserMutation } from '@/Redux/features/user/userApi';
import { useCurrentUser } from '@/Redux/features/auth/authSlice';
import { useAppSelector } from '@/Redux/features/hook';
import useUser from '@/Utils/useUser';
import toast from 'react-hot-toast';
import { IProduct, IUser, useAllProductssQuery } from '@/Interfaces/types';

const SingleCategories = () => {
    const navigate = useNavigate()
    const { category } = useParams();  // Get category from URL params
    const [updateProduct] = useUpdateProductMutation()
    const [updateUser] = useUpdateUserMutation()
    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email) as { user: IUser | null; isLoading: boolean; error: unknown };

    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const handleAddToCart = async (product: IProduct) => {
        try {
            const quantity = 1; // Ensure quantity is retrieved correctly
            const totalPrice = quantity * product.price;

            // Update product stock
            const productResponse = await updateProduct({
                productId: product._id,
                updatedProduct: { quantity: product.quantity - quantity },
            });

            if (!productResponse?.data) {
                throw new Error("Failed to update product stock.");
            }

            // Update user cart
            if (user) {
                const userResponse = await updateUser({
                    userId: user._id,
                    updatedData: {
                        cart: [
                            ...user.cart,
                            { productId: product._id, quantity, price: product.price, totalPrice },
                        ],
                    },
                });

                if (userResponse?.data) {
                    toast.success("Product added to cart successfully!");
                } else {
                    throw new Error("Failed to update user cart.");
                }
            } else {
                throw new Error("User is not logged in.");
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    // State for filters
    const [filters] = useState({
        searchTerm: "",
        categoryFilter: "",
        inStockFilter: "all",
        sortBy: "",
        sortOrder: "asc",
        page: 1,
        minPrice: 0,
        maxPrice: 1000,
    });
    const handleQuantityChange = (productId: string, value: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Number(value),
        }));
    };

    // State for quantity per product
    const { searchTerm, categoryFilter, inStockFilter, sortBy, sortOrder, minPrice, maxPrice } = filters;


    const inStockParam = inStockFilter === "all" ? undefined : inStockFilter === "inStock" ? true : false;
    const { data: products = [] } = useGetProductsQuery<useAllProductssQuery>({
        name: searchTerm || undefined,
        category: categoryFilter || undefined,
        inStock: inStockParam,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
        page: filters.page,
        minPrice,
        maxPrice,
    });

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center my-4">Products in {category}</h2>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">No products found in this category</div>
                ) : (
                    products.map((product) => (
                        <div key={product._id} className="bg-white p-4 rounded-none shadow-md relative">
                            <img src={product.featuredImages} alt={product.name} className="w-full h-40 object-cover mb-4" />
                            <div className="absolute top-2 right-2 bg-primary rounded-full px-2 text-sm">
                                Only {product.quantity} piece left
                            </div>
                            <h2 className="text-lg font-medium text-gray-800">{product.name}</h2>
                            <p className="text-gray-600">৳{product.price}</p>
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
                                    className="w-full bg-primary-foreground text-white py-2 hover:bg-primary"
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
                    ))
                )}
            </div>
        </div>
    );
};

export default SingleCategories;
