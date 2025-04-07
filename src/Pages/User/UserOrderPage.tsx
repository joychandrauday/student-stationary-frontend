/* eslint-disable @typescript-eslint/no-explicit-any */

import LoadingPage from '@/pageComponent/Shared/LoadingPage';
import { useCurrentUser } from '@/Redux/features/auth/authSlice';
import { useAppSelector } from '@/Redux/features/hook';
import { useGetUserOrdersQuery } from '@/Redux/features/order/orderApi';
import { useGetUserQuery } from '@/Redux/features/user/userApi';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { FaBan, FaCalendarAlt, FaCheckCircle, FaCheckDouble, FaClock, FaSyncAlt, FaTimesCircle, FaTruck } from 'react-icons/fa';

// Define the paymentIcons object with correct types
const paymentIcons: { [key: string]: ReactNode } = {
    Canceled: <FaBan className="text-gray-500" />,
    Failed: <FaTimesCircle className="text-red-500" />,
    Success: <FaCheckCircle className="text-green-500" />,
    Completed: <FaCheckDouble className="text-teal-500" />,
};
const statusIcons: { [key: string]: ReactNode } = {
    Pending: <FaClock className="text-orange-500" />,
    Processing: <FaSyncAlt className="text-yellow-500" />,
    Shipped: <FaTruck className="text-blue-500" />,
    Delivered: <FaCheckCircle className="text-green-500" />,
};


const UserOrderPage = () => {
    const userToken = useAppSelector(useCurrentUser);
    const { data: user, isLoading: isUserLoading } = useGetUserQuery(userToken?.email ?? '');
    const { data: orders, isLoading } = useGetUserOrdersQuery(user?._id, { skip: !user?._id });

    if (isUserLoading || isLoading) return <LoadingPage />;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center mb-10 text-gray-800">My Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders?.length ? (
                    orders.map((order: { _id: Key | null | undefined; transaction: { id: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; orderDate: string | number | Date; products: any[]; amount: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; orderStatus: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; paymentStatus: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; }) => (
                        <div key={order._id} className="bg-white  shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                            {/* Order Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Order #{order.transaction.id}</h2>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <FaCalendarAlt />
                                    <span>{new Date(order.orderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Order Products List */}
                            <ul className="space-y-4 mb-6">
                                {order.products.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center text-gray-700">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{item.productId.name}</span>
                                            <span className="text-sm text-gray-500">{item.price}৳ x {item.quantity}</span>
                                        </div>
                                        <span className="font-semibold">{item.totalPrice} ৳</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Order Summary */}
                            <div className="border-t pt-6 mb-4 flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">Total: <span className="text-green-600">{order.amount} ৳</span></span>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Payment:</span>
                                    {paymentIcons[order.paymentStatus as keyof typeof paymentIcons]}
                                    <span className="text-gray-700 font-medium">{order.paymentStatus}</span>
                                </div>
                            </div>
                            <div className="border-t pt-6 mb-4 flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">Order Status:</span>
                                <div className="flex items-center space-x-2">
                                    {statusIcons[order.orderStatus as keyof typeof statusIcons]}
                                    <span className="text-gray-700 font-medium">{order.orderStatus}</span>
                                </div>
                            </div>

                            {/* Payment Status */}

                        </div>

                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">No orders found</div>
                )}
            </div>
        </div>
    );
};

export default UserOrderPage;
