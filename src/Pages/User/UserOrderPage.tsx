/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCurrentUser } from '@/Redux/features/auth/authSlice';
import { useAppSelector } from '@/Redux/features/hook';
import { useGetUserOrdersQuery } from '@/Redux/features/order/orderApi';
import { useGetUserQuery } from '@/Redux/features/user/userApi';
import { useEffect } from 'react';
import { FaTruck, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';

const UserOrderPage = () => {
    const userToken = useAppSelector(useCurrentUser);
    const { data: user, isLoading: isUserLoading, isError: isUserError, error: userError } = useGetUserQuery(userToken?.email ?? '');
    const { data: orders, isLoading, isError, error } = useGetUserOrdersQuery(user?._id, {
        skip: !user?._id,
    });

    useEffect(() => {
        if (isUserError) console.error('Error fetching user:', userError);
        if (isError) console.error('Error fetching orders:', error);
    }, [isUserError, userError, isError, error]);



    if (isUserLoading || isLoading) return <div className="text-center">Loading...</div>;
    if (isUserError || isError) {
        const errorMessage = (userError && 'data' in userError && (userError.data as any).message) || (error && 'data' in error && (error.data as any).message) || 'An unknown error occurred';
        return <div className="text-center text-red-500">Error: {errorMessage}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center mb-10 text-gray-800">My Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders && orders.length > 0 ? (
                    orders.map((order: { _id: string; orderDate: string; products: { productId: { name: string }; price: number; quantity: number; totalPrice: number }[]; amount: number; orderStatus: string; paymentStatus: string }) => (
                        <div
                            key={order._id}
                            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-700">Order #{order._id}</h2>
                                <div className="flex items-center space-x-2">
                                    <FaCalendarAlt className="text-gray-500" />
                                    <span className="text-gray-600">{
                                        new Date(order.
                                            orderDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })
                                    }</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-medium text-lg text-gray-700">Order Details</h3>
                                <ul className="space-y-3">
                                    {order?.products?.map((item: { productId: { name: string }; price: number; quantity: number; totalPrice: number }, index: number) => (
                                        <li key={index} className="flex justify-between text-gray-600">
                                            <span>{item.productId.name} ({item.price}৳ x {item.quantity})</span>
                                            <span>{item.totalPrice} ৳</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-row-reverse justify-between items-start border-t">
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-lg font-semibold text-gray-800">Total: {order.amount} ৳</span>

                                </div>
                                <div className="mt-4">
                                    <h3 className="font-medium text-lg text-gray-700">Order Status</h3>
                                    <div className="flex items-center space-x-2 mt-2">
                                        {order.
                                            orderStatus
                                            === 'Delivered' && <FaCheckCircle className="text-green-500" />}
                                        {order.
                                            orderStatus
                                            === 'Shipped' && <FaTruck className="text-blue-500" />}
                                        {order.
                                            orderStatus
                                            === 'Pending' && <FaTimesCircle className="text-red-500" />}
                                        <span className="text-gray-600">{order.
                                            orderStatus
                                        }</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">

                                        <span className="text-gray-600">{order.
                                            paymentStatus
                                        }</span>
                                    </div>

                                </div>
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
