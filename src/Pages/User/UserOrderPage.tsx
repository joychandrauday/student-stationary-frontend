import { useCurrentUser } from '@/Redux/features/auth/authSlice';
import { useAppSelector } from '@/Redux/features/hook';
import { useGetUserOrdersQuery } from '@/Redux/features/order/orderApi';
import { useGetUserQuery } from '@/Redux/features/user/userApi';
import { useEffect } from 'react';
import { FaTruck, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClock, FaSyncAlt, FaBan, FaCheckDouble } from 'react-icons/fa';

const statusIcons = {
    Pending: <FaClock className="text-orange-500" />,
    Processing: <FaSyncAlt className="text-yellow-500" />,
    Shipped: <FaTruck className="text-blue-500" />,
    Delivered: <FaCheckCircle className="text-green-500" />,
};

const paymentIcons = {
    Canceled: <FaBan className="text-gray-500" />,
    Failed: <FaTimesCircle className="text-red-500" />,
    Success: <FaCheckCircle className="text-green-500" />,
    Completed: <FaCheckDouble className="text-teal-500" />,
};

const UserOrderPage = () => {
    const userToken = useAppSelector(useCurrentUser);
    const { data: user, isLoading: isUserLoading } = useGetUserQuery(userToken?.email ?? '');
    const { data: orders, isLoading } = useGetUserOrdersQuery(user?._id, { skip: !user?._id });

    if (isUserLoading || isLoading) return <div className="text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center mb-10 text-gray-800">My Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders?.length ? (
                    orders.map(order => (
                        <div key={order._id} className="bg-white border p-6 hover:shadow transition duration-300 ease-in-out">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-700">Order #{order.transaction.id}</h2>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <FaCalendarAlt />
                                    <span>{new Date(order.orderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                            <ul className="space-y-2 mb-4">
                                {order.products.map((item, index) => (
                                    <li key={index} className="flex justify-between text-gray-600">
                                        <span>{item.productId.name} ({item.price}৳ x {item.quantity})</span>
                                        <span>{item.totalPrice} ৳</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">Total: {order.amount} ৳</span>
                                <div className="flex items-center flex-col space-x-2 font-semibold">
                                    Order:
                                    <div className="flex items-center space-x-2">
                                        {statusIcons[order.orderStatus]}
                                        <span className="text-gray-700 font-medium">{order.orderStatus}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-2 font-semibold">
                                Payment:
                                {paymentIcons[order.paymentStatus]}
                                <span className="text-gray-700 font-medium">{order.paymentStatus}</span>
                            </div>
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
