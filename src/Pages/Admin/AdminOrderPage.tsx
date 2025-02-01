import { IOrder } from "@/Interfaces/types";
import { useAllOrdersQuery, useDeleteOrderMutation, useUpdateOrderMutation } from "@/Redux/features/order/orderApi";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
interface useAllOrdersQuery {
    data: IOrder[];
    isLoading: boolean;
    error: boolean;
}
const AdminOrderPage = () => {
    // Fetch all orders using the `useAllOrdersQuery` hook
    const { data: orders, refetch, isLoading, error } = useAllOrdersQuery<useAllOrdersQuery>({});

    const [updateOrderStatus] = useUpdateOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();


    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const updatedData = {
            orderStatus: newStatus,
        };

        try {
            await updateOrderStatus({ orderId, updatedData }).unwrap();
            refetch(); // Refetch orders after the update
            toast.success('Updated order status successfully!');
        } catch (err) {
            console.error("Failed to update order status:", err);
            toast.error('Failed to update order status');
        }
    };
    const handleDeleteOrder = async (id: string) => {
        const res = await deleteOrder(id)
        console.log(res);
        toast.success('Deleted order successfully!');
        refetch()
    }
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders!</div>;

    return (
        <div className="p-6 space-y-6  text-white min-h-screen">
            {/* Page Header */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary-foreground">Manage Orders</h1>

            </header>

            {/* Orders Table */}
            <div className="overflow-x-auto bg-gray-800 shadow-md ">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-gray-300 text-left">
                            <th className="py-4 px-4">Order ID</th>
                            <th className="py-4 px-4">Customer</th>
                            <th className="py-4 px-4">Items</th>
                            <th className="py-4 px-4">Total</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4">Date</th>
                            <th className="py-4 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order) => (
                            <tr key={order._id} className="border-b border-gray-700">
                                <td className="py-4 px-4">{order.transaction.id}</td>
                                <td className="py-4 px-4">{order.user.name}</td>
                                <td className="py-4 px-4">{
                                    order.products.length && order.products.map(product => <><li>{product.productId.name}</li></>)
                                }</td>
                                <td className="py-4 px-4">{order.amount}</td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm ${order.orderStatus === "Delivered"
                                            ? "bg-green-200 text-green-800"
                                            : order.orderStatus === "Shipped"
                                                ? "bg-blue-200 text-blue-800"
                                                : order.orderStatus === "Processing"
                                                    ? "bg-yellow-200 text-yellow-800"
                                                    : "bg-red-200 text-red-800"
                                            }`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="py-4 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="py-4 px-4">
                                    <div className="flex space-x-3">
                                        <select
                                            value={order.orderStatus}
                                            defaultValue={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="shadow py-1 bg-primary-foreground hover:bg-primary "
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteOrder(order._id)}
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-400">Showing {orders?.length} orders</span>
                <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gray-700 text-gray-500 rounded-md hover:bg-gray-600">
                        Previous
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-gray-500 rounded-md hover:bg-gray-600">
                        Next
                    </button>
                </div>
            </div>
        </div >
    );
};

export default AdminOrderPage;
