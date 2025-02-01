/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCurrentUser } from '@/Redux/features/auth/authSlice';
import { useAppSelector } from '@/Redux/features/hook';
import { useUpdateUserMutation } from '@/Redux/features/user/userApi';
import useUser from '@/Utils/useUser';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TbCoinTakaFilled } from 'react-icons/tb';
import { FaTrashAlt } from 'react-icons/fa';
import { useUpdateProductMutation } from '@/Redux/features/product/productApi';
import { useCreateOrderMutation } from '@/Redux/features/order/orderApi';

const Cart = () => {
    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email) as { user: { cart: CartItem[]; _id: string } | null };
    interface CartItem {
        productId: {
            _id: string;
            name: string;
            price: number;
            quantity: number;
            featuredImages: string;
        };
        quantity: number;
        price: number;
        totalPrice: number;
    }

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [updateUser] = useUpdateUserMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [createOrder] = useCreateOrderMutation();
    const [shippingAddress, setShippingAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (user?.cart) {
            const updatedCart = user.cart.map((item) => ({
                ...item,
                totalPrice: item.price * item.quantity, // Initial total price
            }));
            setCartItems(updatedCart);
        }

    }, [user?.cart]);

    // Handle Remove Item
    const handleRemoveItem = async (item: CartItem) => {
        const updatedCart = cartItems.filter((i) => i.productId !== item.productId);
        setCartItems(updatedCart);

        // Update product stock
        await updateProduct({
            productId: item.productId._id,
            updatedProduct: { quantity: item.productId.quantity + item.quantity }, // Restore stock
        });

        if (user) {
            updateUser({
                userId: user._id,
                updatedData: { cart: updatedCart },
            })
                .then((response) => {
                    if (response.data) {
                        toast.success('Product removed from cart!');
                    }
                })
                .catch(() => {
                    toast.error('Failed to remove product!');
                    setCartItems(user?.cart || []);
                });
        }
    };

    // Handle Quantity Change
    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const updatedCart = cartItems.map((item) =>
            item.productId._id === id
                ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price }
                : item
        );
        setCartItems(updatedCart);

        if (user) {
            updateUser({
                userId: user._id,
                updatedData: { cart: updatedCart },
            }).catch(() => toast.error('Failed to update quantity!'));
        }
    };

    // Calculate Total Price
    const calculateTotal = () => cartItems.reduce((total, item) => total + item.totalPrice, 0);
    const handleCheckout = async () => {
        setIsProcessing(true);

        try {
            if (!user) {
                toast.error('User not found!');
                setIsProcessing(false);
                return;
            }
            const orderInfo = {
                user: user._id,
                products: cartItems.map((item) => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    price: item.productId.price,
                    totalPrice: item.totalPrice,
                })),
                amount: cartItems.reduce((total, item) => total + item.totalPrice, 0),
                shippingAddress,
                paymentStatus: 'Pending',
                orderStatus: 'Pending',
                estimatedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
                orderDate: new Date(),
            };

            const res = await createOrder(orderInfo).unwrap();
            if (res.payment.checkout_url) {
                window.open(res.payment.checkout_url);
            } else {
                toast.error('Something went wrong!');
            }
        } catch (error) {
            toast.error('Payment initiation failed!');
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Shopping Cart</h2>

            {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Your cart is empty 😢</p>
            ) : (
                <div className="bg-white shadow-md  p-6">
                    {cartItems.map((item) => (
                        item.productId && <div key={item.productId._id} className="flex items-center justify-between border-b py-4">
                            {/* Product Image */}
                            <img
                                src={item.productId?.featuredImages || ''}
                                className="w-16 h-16 object-cover rounded-lg"
                            />

                            {/* Product Info */}
                            <div className="flex-1 ml-4">
                                <h3 className="text-lg text-primary font-medium">{item.productId?.name || ''}</h3>
                                <div className="text-gray-600 flex items-center gap-2">
                                    <TbCoinTakaFilled /> {item.productId.price || 0} BDT
                                </div>
                                <div className="wrap text-primary ">
                                    X {item.quantity}
                                </div>
                            </div>
                            {/* Quantity Controls */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md"
                                >
                                    -
                                </button>
                                <span className="px-4">{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md"
                                >
                                    +
                                </button>
                            </div>

                            {/* Total Price */}
                            <div className="text-gray-700 font-semibold">{item.totalPrice || 0} BDT</div>

                            {/* Remove Button */}
                            <button
                                onClick={() => handleRemoveItem(item)}
                                className="text-red-500 hover:text-red-700 ml-4"
                            >
                                <FaTrashAlt size={18} />
                            </button>
                        </div>
                    ))}
                    {/* Total Price & Checkout */}
                    {cartItems.length > 0 && (
                        <div className="mt-6 p-6   shadow-md text-center">
                            <h3 className="text-xl text-primary font-semibold">Total: {calculateTotal()} BDT</h3>

                            {/* Shipping Address Form */}
                            <div className="mt-4">
                                <label htmlFor="shippingAddress" className="block text-gray-700 font-medium mb-2">
                                    Shipping Address:
                                </label>
                                <input
                                    type="text"
                                    name="shippingAddress"
                                    id="shippingAddress"
                                    className="w-full px-4 py-2 border border-gray-300 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter your shipping address here..."
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </div>

                            <button
                                className={`w-full mt-4 py-3 text-white transition-all ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-foreground hover:bg-primary'}`}
                                onClick={handleCheckout}
                                disabled={shippingAddress === '' || isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Checkout'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;
