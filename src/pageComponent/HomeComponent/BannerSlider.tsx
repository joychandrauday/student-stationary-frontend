import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactSimplyCarousel from "react-simply-carousel";

const BannerSlider: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prevSlide) => (prevSlide + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="md:h-screen min-h-[50vh] overflow-hidden relative">
            <ReactSimplyCarousel
                activeSlideIndex={activeSlide}
                onRequestChange={setActiveSlide}
                itemsToShow={1}
                itemsToScroll={1}
                responsiveProps={[
                    { itemsToShow: 1, itemsToScroll: 1, minWidth: 0 },
                ]}
                speed={400}
                easing="linear"
                containerProps={{
                    style: { overflow: "hidden", width: "100%", margin: "0 auto" },
                }}
            >
                {/* Slide 1 - Stationary Essentials */}
                <div
                    className="w-screen md:h-screen min-h-[50vh] bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=1468&auto=format&fit=crop)`,
                    }}
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10 text-left  px-4 sm:px-8 md:px-12 lg:px-20">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white drop-shadow-lg">
                            Stationary Essentials
                        </h1>
                        <p className="text-md sm:text-lg text-white mt-4 drop-shadow-md">
                            Everything you need for your office and study space.
                        </p>
                        <button onClick={() => navigate(`/products?searchTerm=Office`)} className="mt-6 px-6 sm:px-8 py-2 sm:py-3 group bg-primary-foreground text-white font-semibold rounded-full shadow-lg hover:bg-primary transition duration-300 flex items-center justify-center space-x-2">
                            <span>Explore Now</span>
                            <span className="text-lg transition-all duration-300 group-hover:translate-x-1">
                                <ArrowRight />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Slide 2 - Premium Pens & Pencils */}
                <div
                    className="w-screen md:h-screen min-h-[50vh] bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?q=80&w=1469&auto=format&fit=crop)`,
                    }}
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10 text-center px-4 sm:px-8 md:px-12 lg:px-20">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white drop-shadow-lg">
                            Premium Pens & Pencils
                        </h1>
                        <p className="text-md sm:text-lg text-white mt-4 drop-shadow-md">
                            Explore our range of premium pens and pencils.
                        </p>
                        <button onClick={() => navigate(`/products?searchTerm=pen`)} className="mt-6 px-6 sm:px-8 py-2 sm:py-3 group bg-primary-foreground text-white font-semibold rounded-full shadow-lg hover:bg-primary transition duration-300 flex items-center justify-center space-x-2 mx-auto">
                            <span>Shop Now</span>
                            <span className="text-lg transition-all duration-300 group-hover:translate-x-1">
                                <FaShoppingCart />
                            </span>
                        </button>
                    </div>
                </div>
            </ReactSimplyCarousel>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-4 absolute bottom-4 left-0 right-0">
                {[0, 1].map((index) => (
                    <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${activeSlide === index ? "bg-white scale-110" : "bg-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
