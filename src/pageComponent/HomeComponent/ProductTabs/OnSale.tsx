import { useRef } from "react";
import { Brand, useGetProductsQuery } from "@/Redux/features/product/productApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import { ShoppingCart, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "@/Redux/features/cart/cartSlice";
import { IProduct } from "@/Interfaces/types";
const OnSale = () => {
    const { data } = useGetProductsQuery({ status: 'sale' });
    const { products } = data || {}
    const swiperRef = useRef(null);

    const dispatch = useDispatch()
    const handleAddToCart = (product: IProduct) => {
        dispatch(addProduct(product))
    };
    const isBrand = (brand: string | Brand | { name: string }): brand is Brand | { name: string } => {
        return typeof brand !== "string"; // It's either a Brand object or an inline object with 'name'
    };
    return (
        <div className="container mx-auto px-4 py-10">
            <div className="relative w-full mx-auto">
                <Swiper
                    ref={swiperRef}
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={4}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: true }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                    }}
                >
                    {products && products.map((product) => (
                        <SwiperSlide key={product._id} className="flex justify-center">
                            <div className="relative border p-4 rounded-lg shadow-lg flex flex-col items-center transition-transform transform duration-300">
                                {/* Quantity Ribbon */}
                                {product.quantity > 0 && (
                                    <div className="absolute top-2 left-0 bg-red-600 text-white text-xs font-bold px-4 py-1 shadow-lg rotate-[-20deg] rounded-l-md before:absolute before:top-full before:left-0 before:border-l-8 before:border-t-8 before:border-t-transparent before:border-l-red-800 after:absolute after:top-full after:right-0 after:border-r-8 after:border-t-8 after:border-t-transparent after:border-r-red-800">
                                        {product.quantity} in stock
                                    </div>
                                )}
                                {
                                    product.offerPrice > 0 && (<Badge className="absolute top-2 right-2 bg-[#EA580C] text-white text-xs px-2 py-1 flex items-center gap-1">
                                        <Tag size={12} />{" "}
                                        {Math.round(
                                            ((product.price - product.offerPrice) / product.price) * 100
                                        )}
                                        % OFF
                                    </Badge>)
                                }
                                <img src={product.featuredImages} alt={product.name} className="w-full border h-40 object-cover rounded-md mb-4" />
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="text-lg font-semibold text-primary ">{product.name}</h3>
                                </Link>
                                <p className="text-gray-400 text-sm">
                                    {isBrand(product.brand) ? product.brand.name : product.brand} {/* Safely access 'name' */}
                                </p>

                                {/* Offer Price Section */}
                                <div className="flex items-center space-x-2">
                                    {product.offerPrice ? (
                                        <>
                                            <p className="text-primary font-bold text-lg">৳{product.offerPrice}</p>
                                            <p className="text-gray-400 line-through text-sm">৳{product.price}</p>
                                        </>
                                    ) : (
                                        <p className="text-primary font-bold text-lg">৳{product.price}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="mt-3 bg-primary-foreground gap-2 items-center flex hover:bg-opacity-80 text-white px-4 py-2 rounded-md transition-all duration-300"
                                >
                                    <ShoppingCart /> Add to Cart
                                </button>
                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default OnSale;
