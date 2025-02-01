import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiscountGrid = () => {
    const navigate = useNavigate()
    return (
        <div className="container mx-auto py-12 px-4 md:px-8 lg:px-12 overflow-hidden">
            <div className="wrapper">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Grid Item 1 */}
                    <div
                        className="grid-item h-[28vh] sm:h-[70vh] lg:h-[80vh] bg-center hover:bg-left transition-all duration-500 ease-in-out shadow-lg bg-cover"
                        style={{
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                        }}
                    >
                        <div className="flex justify-center items-start h-full bg-black bg-opacity-50 text-center text-white text-xl sm:text-2xl lg:text-3xl font-semibold pt-12">
                            <div className="p-4 text-left">
                                <span>Up to 50% OFF on Selected Items</span>
                                <div className="mt-4">
                                    <button onClick={() => (window.location.hash = 'on-sale')} className="px-6 text-sm border rounded-full py-2 bg-transparent text-white font-semibold transition duration-300 flex items-center justify-center group">
                                        Shop Now
                                        <ArrowRightIcon className="group-hover:translate-x-1 transition duration-300 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Item 2 */}
                    <div
                        className="grid-item h-[28vh] sm:h-[70vh] lg:h-[80vh] bg-center hover:bg-left transition-all duration-500 ease-in-out shadow-lg bg-cover"
                        style={{
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1580569214296-5cf2bffc5ccd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                        }}
                    >
                        <div className="flex justify-center items-start h-full bg-black bg-opacity-50 text-center text-white text-xl sm:text-2xl lg:text-3xl font-semibold pt-12">
                            <div className="p-4 text-left">
                                <span>Buy One Get One Free</span>
                                <div className="mt-4">
                                    <button onClick={() => navigate(`/explore`)} className="px-6 text-sm border rounded-full py-2 bg-transparent text-white font-semibold transition duration-300 flex items-center justify-center group">
                                        Shop Now
                                        <ArrowRightIcon className="group-hover:translate-x-1 transition duration-300 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Item 3 (Split into Two Smaller Items) */}
                    <div className="grid-item flex flex-col gap-6">
                        {/* Sub-Item 1 */}
                        <div
                            className="h-[28vh] sm:h-[32vh] lg:h-[38vh] bg-center hover:bg-left transition-all duration-500 ease-in-out shadow-lg bg-cover"
                            style={{
                                backgroundImage:
                                    'url("https://images.unsplash.com/photo-1593526270954-da9b60206ad4?q=80&w=1457&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                            }}
                        >
                            <div className="flex justify-center items-start h-full bg-black bg-opacity-50 text-center text-white text-xl sm:text-2xl lg:text-3xl font-semibold p-6">
                                <div className="text-left">
                                    <span>Exclusive Summer Deals</span>
                                    <div className="mt-4">
                                        <button onClick={() => navigate(`/explore`)} className="px-6 text-sm border rounded-full py-2 bg-transparent text-white font-semibold transition duration-300 flex items-center justify-center group">
                                            Shop Now
                                            <ArrowRightIcon className="group-hover:translate-x-1 transition duration-300 ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sub-Item 2 */}
                        <div
                            className="h-[28vh] sm:h-[32vh] lg:h-[38vh] bg-center hover:bg-left transition-all duration-500 ease-in-out shadow-lg bg-contain"
                            style={{
                                backgroundImage:
                                    'url("https://plus.unsplash.com/premium_photo-1663956066898-282c7609afc9?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                            }}
                        >
                            <div className="flex justify-center items-start h-full bg-black bg-opacity-50 text-center text-white text-xl sm:text-2xl lg:text-3xl font-semibold p-6">
                                <div className="text-left">
                                    <span>Special Winter Offers</span>
                                    <div className="mt-4">
                                        <button onClick={() => navigate(`/explore`)} className="px-6 text-sm border rounded-full py-2 bg-transparent text-white font-semibold transition duration-300 flex items-center justify-center group">
                                            Shop Now
                                            <ArrowRightIcon className="group-hover:translate-x-1 transition duration-300 ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default DiscountGrid;
