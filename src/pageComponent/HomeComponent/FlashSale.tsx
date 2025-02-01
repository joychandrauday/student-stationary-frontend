
import { FaShoppingCart } from "react-icons/fa";
import { useGetProductsQuery, useUpdateProductMutation } from "@/Redux/features/product/productApi";
import { useUpdateUserMutation } from "@/Redux/features/user/userApi";
import { useCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/features/hook";
import useUser from "@/Utils/useUser";
import { IProduct, IUser, useAllProductssQuery } from "@/Interfaces/types";
import addToCart from "@/Utils/addToCard";
import { HiCurrencyBangladeshi } from "react-icons/hi2";

const FlashSale = () => {
    const [updateProduct] = useUpdateProductMutation();
    const [updateUser] = useUpdateUserMutation();
    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email) as { user: IUser | null; isLoading: boolean; error: unknown };


    const { data: products = [] as IProduct[], refetch } = useGetProductsQuery<useAllProductssQuery>({});
    const productF = products.filter((product: IProduct) => product.status === 'sale');

    const handleAddToCart = (product: IProduct) => {
        addToCart(product, user, updateProduct, updateUser, refetch);
    };
    return (
        <div id="on-sale" className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* 🔥 Flash Sale Banner */}
            <div className="relative w-full max-w-4xl text-center py-6 px-8 bg-red-600 shadow-lg text-3xl font-bold backdrop-blur-lg">
                FLASH SALE!
            </div>

            {/* 📦 Flash Sale Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full max-w-6xl">
                {productF.map((product: IProduct) => (
                    <div key={product._id} className="relative border border-gray-700 p-5  shadow-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 ">

                        <img src={product.featuredImages} alt={product.name} className="w-full h-44 object-cover shadow-md" />
                        <span className="absolute top-2 right-2 bg-primary-foreground text-white font-bold px-3 py-1 text-sm transform rotate-12 shadow-lg rounded-bl-lg before:content-[''] before:absolute before:inset-0 before:bg-white/20 before:rounded-bl-lg before:animate-shine">
                            {product.discount}% off
                        </span>

                        <h3 className="text-xl font-semibold mt-4 text-white">{product.name}</h3>
                        <div className="flex justify-between items-center">
                            <p className="text-red-400 font-bold text-xl flex items-center"><HiCurrencyBangladeshi /> {product.price}</p>
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
                        </div>
                        <button className="mt-4 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-none w-full hover:bg-red-600 transition" onClick={() => handleAddToCart(product)}>
                            <FaShoppingCart className="mr-2" /> Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashSale;
