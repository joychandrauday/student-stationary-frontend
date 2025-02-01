
import { FaShoppingBag } from "react-icons/fa";

const ImageGrid = () => {


    return (
        <div className="container mx-auto min-h-screen flex items-center justify-center px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left Side - Banners */}
                <div className="grid grid-cols-2 gap-4">
                    <img
                        src="https://i.pinimg.com/736x/c4/34/f8/c434f886fcb9b4352087fee2d0653f11.jpg"
                        alt="Banner 1"
                        className="w-full h-full shadow-lg "
                    />
                    <img
                        src="https://i.pinimg.com/736x/01/ed/22/01ed2258b3377f610887af996633bd1e.jpg"
                        alt="Banner 2"
                        className="w-full h-full shadow-lg "
                    />
                </div>

                {/* Right Side - Text Content */}
                <div className="space-y-4" data-aos="fade-left">
                    <h2 className="text-3xl font-bold text-gray-800">
                        High-Quality Stationery Items
                    </h2>
                    <p className="text-gray-600">
                        Discover our premium collection of notebooks, pens, and office
                        supplies designed to enhance your productivity.
                    </p>
                    <button className="bg-primary-foreground text-white px-6 py-3 flex items-center gap-2 hover:bg-primary transition duration-300 group">
                        <a href="/products">Shop Now</a>
                        <FaShoppingBag className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageGrid;
