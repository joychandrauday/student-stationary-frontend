/* eslint-disable react-hooks/exhaustive-deps */
import { IProduct, IUser, useAllProductssQuery } from "@/Interfaces/types";
import { useCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/features/hook";
import { useGetProductsQuery, useUpdateProductMutation } from "@/Redux/features/product/productApi";
import { useUpdateUserMutation } from "@/Redux/features/user/userApi";
import useUser from "@/Utils/useUser";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Explore = () => {
    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email) as { user: IUser | null; isLoading: boolean; error: unknown };
    const [updateUser] = useUpdateUserMutation();
    const [updateProduct] = useUpdateProductMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // State for filters
    const [filters, setFilters] = useState({
        searchTerm: "",
        categoryFilter: "",
        inStockFilter: "all",
        sortBy: "",
        sortOrder: "asc",
        page: 1,
        minPrice: 0,
        maxPrice: 1000,
    });
    useEffect(() => {
        if (queryParams) {
            const searchTermParam = queryParams.get("search");
            console.log(searchTermParam);
            if (searchTermParam) {
                setFilters((prev) => ({
                    ...prev,
                    searchTerm: searchTermParam,
                }));
            }
        }
    }, []);

    // State for quantity per product
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const { searchTerm, categoryFilter, inStockFilter, sortBy, sortOrder, minPrice, maxPrice } = filters;

    // Fetch products with filtering and search logic
    const inStockParam = inStockFilter === "all" ? undefined : inStockFilter === "inStock" ? true : false;

    // Fetch products with filtering and search logic
    const { data: products = [], isLoading, isError } = useGetProductsQuery<useAllProductssQuery>({
        name: searchTerm || undefined,  // Filter by search term
        category: categoryFilter || undefined,
        inStock: inStockParam,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
        page: filters.page,
        minPrice,
        maxPrice,
    });





    // Handle quantity change for products in the cart
    const handleQuantityChange = (productId: string, value: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Number(value),
        }));
    };

    // Handle adding product to the cart
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



    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching products.</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Explore all</h1>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
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
                    ))}
                </div>


            </div>
        </div>
    );
};

export default Explore;
