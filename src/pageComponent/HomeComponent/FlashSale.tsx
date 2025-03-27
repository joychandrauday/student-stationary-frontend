import { FaShoppingCart } from "react-icons/fa";
import { useGetProductsQuery } from "@/Redux/features/product/productApi";
import { HiCurrencyBangladeshi } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addProduct } from "@/Redux/features/cart/cartSlice";
import CountDown from "@/Utils/CountDown";
import { IProduct } from "@/Interfaces/types";

const FlashSale = () => {
    const { data } = useGetProductsQuery({ status: 'sale' });
    const { products } = data || {};
    console.log(products);

    const dispatch = useDispatch();

    const handleAddToCart = (product: IProduct) => {
        dispatch(addProduct(product));
        console.log("Added to Cart:", product.name);
    };

    return (
        <div id="on-sale" className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* 🔥 Flash Sale Banner */}
            <motion.div
                className="relative w-full max-w-4xl text-center py-6 px-8 
                       shadow-2xl text-3xl font-extrabold text-white 
                       uppercase tracking-wide  
                       backdrop-blur-lg overflow-hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                    background: [
                        "linear-gradient(to right, #ff4e50, #fc913a, #ffcc67)",
                        "linear-gradient(to right, #fc913a, #ffcc67, #a8e6cf)",
                        "linear-gradient(to right, #ffcc67, #a8e6cf, #379683)",
                        "linear-gradient(to right, #a8e6cf, #379683, #ff4e50)",
                    ],
                    transition: { duration: 2, repeat: Infinity, ease: "linear" },
                }}
            >
                <span className="relative text-primary z-10 drop-shadow-lg">FLASH SALE!</span>
                <CountDown />
                {/* Fancy Ribbon Effect */}
                <div className="absolute -top-0 -right-8 rotate-12 bg-red-700 
                            text-white px-4 py-1 text-sm font-semibold 
                            shadow shadow-black">
                    Limited Time offer!
                </div>

                {/* Shimmering Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full animate-[shimmer_3s_infinite] opacity-20" />
            </motion.div>

            {/* 📦 Flash Sale Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full max-w-6xl">
                {products && products.map((product) => (
                    // Check if product._id is defined before rendering
                    product._id ? (
                        <div key={product._id} className="relative border border-gray-700 p-5 shadow-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 ">
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
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default FlashSale;
