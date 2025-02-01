import { FaShippingFast, FaLock, FaTag, FaHeadset } from "react-icons/fa";

const OurService = () => {
    return (
        <div className="px-4 md:px-8 bg-gray-50 border-b py-8">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 items-center justify-center lg:grid-cols-4 gap-6">
                {/* Fast Delivery */}
                <div className="flex items-center justify-center  text-center md:text-left p-4">
                    <FaShippingFast className="text-4xl text-blue-600 sm:mb-0 mb-2" />
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">Fast Delivery</h3>
                        <p className="text-gray-600 text-sm">For all orders over $120</p>
                    </div>
                </div>

                {/* Safe Payments */}
                <div className="flex items-center text-center md:text-left p-4 justify-center ">
                    <FaLock className="text-4xl text-green-600 sm:mb-0 mb-2" />
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">Safe Payments</h3>
                        <p className="text-gray-600 text-sm">100% secure payment</p>
                    </div>
                </div>

                {/* Discount Coupons */}
                <div className="flex items-center text-center md:text-left p-4 justify-center ">
                    <FaTag className="text-4xl text-red-600 sm:mb-0 mb-2" />
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">Discount Coupons</h3>
                        <p className="text-gray-600 text-sm">Enjoy Huge Promotions</p>
                    </div>
                </div>

                {/* Quality Support */}
                <div className="flex items-center text-center md:text-left p-4 justify-center ">
                    <FaHeadset className="text-4xl text-purple-600 sm:mb-0 mb-2" />
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">Quality Support</h3>
                        <p className="text-gray-600 text-sm">Dedicated 24/7 support</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurService;
