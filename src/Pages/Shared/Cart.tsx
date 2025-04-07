/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrementOrderQuantity, incrementOrderQuantity, orderedProducts, removeItem } from "@/Redux/features/cart/cartSlice";
import { FaTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/Redux/features/hook";
import { useCreateOrderMutation } from "@/Redux/features/order/orderApi";
import toast from "react-hot-toast";
import { RootState } from "@/Redux/features/store";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

const cities = [
    "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria", "Chandpur", "Chattogram", "Chuadanga",
    "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj",
    "Jamalpur", "Jashore", "Jhalokathi", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram",
    "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
    "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali",
    "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira",
    "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
];

const Cart = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const products = useAppSelector(orderedProducts);
    const [createOrder] = useCreateOrderMutation();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);

    const subtotal = products.reduce((acc, item) => {
        const price = item.offerPrice ? item.offerPrice : item.price;
        return acc + price * item.orderQuantity;
    }, 0);
    const total = subtotal + shippingCost;

    const updateQuantity = (id: string, type: "inc" | "dec") => {
        if (type === "inc") dispatch(incrementOrderQuantity(id));
        else dispatch(decrementOrderQuantity(id));
    };

    const handleCityChange = (e: { target: { value: any; }; }) => {
        const selectedCity = e.target.value;
        setFormData({ ...formData, city: selectedCity });

        if (selectedCity === "Dhaka") setShippingCost(100);
        else if (selectedCity === "Chattogram") setShippingCost(150);
        else setShippingCost(200);
    };

    const handleCheckout = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        const orderInfo = {
            user: user?.id,
            products: products.map(product => ({
                productId: product._id,
                quantity: product.orderQuantity,
                price: product.price,
                totalPrice: product.price * product.orderQuantity
            })),
            amount: total,
            shippingAddress: `${formData.address}, ${formData.city}`,
            phone: formData.phone,
            paymentStatus: 'Pending',
            orderStatus: 'Pending',
            estimatedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
            orderDate: new Date(),
        };
        try {
            const { payment } = await createOrder(orderInfo).unwrap();
            if (payment?.checkout_url) {
                window.location.href = payment.checkout_url;
            } else {
                toast.error('Payment URL not provided. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Error processing your order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 w-full mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cart Section */}
            <div className="shadow-lg rounded-lg p-6 bg-white text-primary space-y-6">
                <h2 className="text-3xl font-semibold text-center">Your Shopping Cart</h2>
                {products.length === 0 ? (
                    <p className="text-center">Your cart is empty.</p>
                ) : (
                    products.map((item) => (
                        <div key={item._id} className="flex relative items-center justify-between p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <img width={100} height={100} src={item.featuredImages} className="w-20 h-20 object-cover rounded-md" />
                            <div className="flex-1 ml-4">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-500">৳{item.price} | Quantity: {item.orderQuantity ?? 0}</p>
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => updateQuantity(item._id as string, "dec")} className="px-3 py-1 border rounded-l hover:bg-gray-200" disabled={item.orderQuantity === 1}>-</button>
                                <span className="px-4 py-1">{item.orderQuantity}</span>
                                <button onClick={() => updateQuantity(item._id as string, "inc")} className="px-3 py-1 border rounded-r hover:bg-gray-200" disabled={item.orderQuantity >= (item.quantity ?? 0)}>+</button>
                            </div>
                            <button onClick={() => dispatch(removeItem(item._id))} className=" ml-4 hover:text-red-700 transition-colors duration-200"><FaTrashAlt /></button>
                            {
                                item.offerPrice ? (
                                    <Badge className="absolute top-0 right-0 rounded-b-none rounded-l-none hover:bg-primary-foreground text-white text-xs px-2 py-1 flex items-center gap-1 shadow ">
                                        <Tag size={12} />{" "}
                                        {Math.round(((item.price - (item.offerPrice ?? item.price)) / item.price) * 100)}% OFF
                                    </Badge>
                                ) : null
                            }
                        </div>

                    ))
                )}
            </div>

            {/* Order Summary & Address */}
            <div className="shadow-lg rounded-lg p-6 text-primary bg-white space-y-6">
                <h2 className="text-3xl font-semibold text-center">Shipping Information</h2>

                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FB8600] mb-4"
                    placeholder="Enter your address"
                />

                <select
                    name="city"
                    value={formData.city}
                    onChange={handleCityChange}
                    required
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FB8600] mb-4"
                >
                    <option value="" disabled>Select your city</option>
                    {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                    ))}
                </select>

                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FB8600] mb-6"
                    placeholder="Phone Number"
                />

                <p className="text-lg">Subtotal: <span className="font-semibold">৳{subtotal.toFixed(2)}</span></p>
                <p className="text-lg">Shipping Cost: <span className="font-semibold">৳{shippingCost}</span></p>
                <p className="text-lg font-bold">Total: <span className="">৳{total.toFixed(2)}</span></p>

                {
                    user ?
                        <Button
                            onClick={handleCheckout}
                            disabled={loading || !formData.address || !formData.city || !formData.phone}
                            className="w-full bg-primary-foreground py-3 rounded-lg mt-6 text-white hover:bg-primary transition-colors duration-300"
                        >
                            {loading ? 'Processing...' : 'Confirm Order'}
                        </Button>
                        : <>
                            <p className="text-center text-gray-500">Please login to checkout your order.</p>
                        </>
                }
            </div>
        </div >
    );
};

export default Cart;
