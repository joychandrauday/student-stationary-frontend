
import { FaShoppingCart } from "react-icons/fa";
import { useGetProductsQuery, useUpdateProductMutation } from "@/Redux/features/product/productApi";
import { useUpdateUserMutation } from "@/Redux/features/user/userApi";
import { useCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/features/hook";
import useUser from "@/Utils/useUser";
import toast from "react-hot-toast";
import { IProduct, IUser, useAllProductssQuery } from "@/Interfaces/types";

const FlashSale = () => {
    const [updateProduct] = useUpdateProductMutation();
    const [updateUser] = useUpdateUserMutation();
    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email) as { user: IUser | null; isLoading: boolean; error: unknown };

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

    const { data: products = [] as IProduct[] } = useGetProductsQuery<useAllProductssQuery>({});
    const productF = products.filter((product: IProduct) => product.status === 'sale');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* 🔥 Flash Sale Banner */}
            <div className="relative w-full max-w-4xl text-center py-6 px-8 bg-red-600 shadow-lg text-3xl font-bold backdrop-blur-lg">
                FLASH SALE!
            </div>

            {/* 📦 Flash Sale Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full max-w-6xl">
                {productF.map((product: IProduct) => (
                    <div key={product._id} className="relative border border-gray-700 p-5 rounded-lg shadow-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300">
                        <img src={product.featuredImages} alt={product.name} className="w-full h-44 object-cover rounded-md shadow-md" />
                        <h3 className="text-xl font-semibold mt-4 text-white">{product.name}</h3>
                        <p className="text-red-400 font-bold text-xl">${product.price}</p>
                        <button className="mt-4 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition" onClick={() => handleAddToCart(product)}>
                            <FaShoppingCart className="mr-2" /> Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashSale;
