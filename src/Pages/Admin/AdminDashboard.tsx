import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBox, FaUsers, FaShoppingCart } from "react-icons/fa"; // Importing icons
import { useGetProductsQuery } from "@/Redux/features/product/productApi";
import { useGetUsersQuery } from "@/Redux/features/user/userApi";
import { useAllOrdersQuery } from "@/Redux/features/order/orderApi";
import { HiCurrencyBangladeshi } from "react-icons/hi2";
import { IOrder } from "@/Interfaces/types";
const AdminDashboard = () => {
    // Fetch data dynamically
    const { data: products } = useGetProductsQuery({});
    const { data: users } = useGetUsersQuery({});
    const { data: orders } = useAllOrdersQuery({});

    // Calculate total revenue from all orders
    const totalRevenue = orders?.reduce((total: number, order: { amount: number }) => total + parseFloat(order.amount as unknown as string), 0) || 0;

    const summaryData = [
        {
            title: "Products",
            icon: <FaBox className="text-2xl" />,
            value: products?.length || 0,
        },
        {
            title: "Users",
            icon: <FaUsers className="text-2xl" />,
            value: users?.length || 0,
        },
        {
            title: "Orders",
            icon: <FaShoppingCart className="text-2xl" />,
            value: orders?.length || 0,
        },
        {
            title: "Revenue",
            icon: <HiCurrencyBangladeshi className="text-3xl" />,
            value: `${totalRevenue.toFixed(2)}`,
        },
    ];

    const recentOrders = orders?.slice(0, 5).map((order: IOrder) => ({
        id: order._id,
        customer: order.user.name, // Assuming customer has a name field
        total: `৳${order.amount}`,
        date: new Date(order.orderDate).toLocaleDateString(),
        status: order.orderStatus,
    })) || [];
    return (
        <div className="p-6 space-y-6">
            {/* Dashboard Header */}
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Button variant="default">View Reports</Button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {summaryData.map((item, index) => (
                    <Card key={index} className="shadow-md">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                {item.icon}
                                <CardTitle>{item.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{item.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="shadow-md p-4 bg-white rounded-lg">
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Order ID</th>
                            <th className="px-4 py-2 text-left">Customer</th>
                            <th className="px-4 py-2 text-left">Total</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order: { id: string; customer: string; total: number; date: string; status: string }) => (
                            <tr key={order.id} className="border-b">
                                <td className="px-4 py-2">{order.id}</td>
                                <td className="px-4 py-2">{order.customer}</td>
                                <td className="px-4 py-2">{order.total}</td>
                                <td className="px-4 py-2">{order.date}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded-lg text-sm ${order.status === "Completed"
                                            ? "bg-green-200 text-green-800"
                                            : order.status === "Pending"
                                                ? "bg-yellow-200 text-yellow-800"
                                                : "bg-red-200 text-red-800"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
