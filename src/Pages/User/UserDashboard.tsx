import { useAllOrdersQuery } from '@/Interfaces/types';
import LoadingPage from '@/pageComponent/Shared/LoadingPage';
import { orderedProducts } from '@/Redux/features/cart/cartSlice';
import { useAppSelector } from '@/Redux/features/hook';
import { useGetUserOrdersQuery } from '@/Redux/features/order/orderApi';
import useUser from '@/Utils/useUser';
import { FaBox, FaShoppingCart, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

const UserDashboard = () => {
    const { user, isLoading: userLoading, error: userError } = useUser(undefined) as { user: { _id: string, avatar: string, name: string, cart?: { id: string, quantity: number }[] } | null, isLoading: boolean, error: Error | null };
    const userId = user?._id ?? '';
    const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetUserOrdersQuery<useAllOrdersQuery>(userId, {
        skip: !userId,
    });
    const products = useAppSelector(orderedProducts);
    if (userLoading || ordersLoading) {
        return <LoadingPage />; // Or you can show a spinner here
    }

    if (userError || ordersError) {
        return <div>Error loading data. Please try again later.</div>;
    }

    if (!user) {
        return <div>User not found.</div>; // This handles the case when user is null or undefined
    }
    // Calculate the total spent from the amount of all orders
    const totalSpent = orders.reduce((acc: number, order: { amount: number }) => acc + order.amount, 0);

    return (
        <div>
            <div className="bg-white shadow-lg p-6 flex flex-col items-center space-y-4 md:basis-1/3">
                <img
                    src={user.avatar}
                    alt="User Profile"
                    className="w-24 h-24 rounded-full border-4 border-blue-500"
                />
                <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">Welcome back to your dashboard!</p>
            </div>

            {/* Dashboard Stats */}
            <div className="bg-white shadow-lg justify-between mx-auto p-6 flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="flex items-center gap-4">
                    <FaClipboardList className="text-blue-500 text-3xl" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Total Orders</h3>
                        <p className="text-lg text-gray-600">{orders?.length || 0}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaShoppingCart className="text-green-500 text-3xl" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Items in Cart</h3>
                        {/* Assuming you have cart data, otherwise you can add this logic */}
                        <p className="text-lg text-gray-600">{products?.length || 0} items</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaBox className="text-yellow-500 text-3xl" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Total Spent</h3>
                        <p className="text-lg text-gray-600">{totalSpent} ৳</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
                <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex justify-between items-center border-b pb-4">
                            <div>
                                <p className="text-lg text-gray-800">Order #{order.transaction.id}</p>
                                <p className="text-sm text-gray-500">
                                    <FaCalendarAlt className="inline-block mr-1" />
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-800">{order.amount} ৳</p>
                                <p className={`text-sm font-semibold ${order.orderStatus === 'Delivered' ? 'text-green-500' : order.orderStatus === 'Shipped' ? 'text-blue-500' : 'text-red-500'}`}>
                                    order: {order.orderStatus}
                                </p>
                                <p className={`text-sm font-semibold ${order.orderStatus === 'Delivered' ? 'text-green-500' : order.paymentStatus === 'Completed' ? 'text-blue-500' : 'text-red-500'}`}>
                                    payment: {order.paymentStatus}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}

export default UserDashboard;
