import { FaChartPie, FaFileAlt, FaUsers, FaShoppingCart } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useAllOrdersQuery } from '@/Redux/features/order/orderApi';
import { useGetProductsQuery } from '@/Redux/features/product/productApi';
import { useGetUsersQuery } from '@/Redux/features/user/userApi';
import { IOrder, useAllProductssQuery, useAllUsersQuery } from '@/Interfaces/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/studentstationarylogonav.png'

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
interface useAllOrdersQuery {
    data: IOrder[];
    isLoading: boolean;
    error: boolean;
}
const AdminReport = () => {
    // Fetch data
    const { data: users, isLoading: usersLoading } = useGetUsersQuery<useAllUsersQuery>({});
    const { data: products, isLoading: productsLoading } = useGetProductsQuery<useAllProductssQuery>({});
    const { data: orders, isLoading: ordersLoading } = useAllOrdersQuery<useAllOrdersQuery>({});

    // Sales data for the chart (Dynamic sales data based on the orders)
    const salesData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Sales Overview',
                data: orders ? orders.map(order => order.amount) : [0, 0, 0, 0, 0], // Dynamically using order amounts
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.4,
            },
        ],
    };

    // Top-selling products logic
    const topSellingProducts = orders?.reduce((acc: { [key: string]: unknown }, order) => {
        order.products.forEach(product => {
            if (product?.productId?._id && acc[product.productId._id]) {
                (acc[product?.productId?._id] as { quantity: number }).quantity += product.quantity;
                if (product?.productId?._id) {
                    acc[product.productId._id] = { ...product, quantity: product.quantity };
                }
            } else {
                acc[product?.productId?._id] = { ...product, quantity: product.quantity };
            }
        });
        return acc;
    }, {});

    interface TopSellingProduct {
        _id: string;
        name: string;
        quantity: number;
        price: number;
        productId: {
            _id: string;
            featuredImages: string;
        }
    }

    const sortedTopSelling: TopSellingProduct[] = Object.values(topSellingProducts || {}).map(product => product as TopSellingProduct).sort(
        (a, b) => (a as TopSellingProduct).quantity - (b as TopSellingProduct).quantity
    );
    // Chart options
    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.addImage(logo, 'PNG', 160, 10, 45, 13);
        doc.setFontSize(18);
        doc.text('Admin Sales Report', 14, 15);

        const totalSales = orders.reduce((total, order) => total + order.amount, 0) || 0;
        const totalUsers = users.length || 0;
        const totalOrders = orders.length || 0;

        doc.setFontSize(12);
        doc.text(`Total Sales: ৳${totalSales}`, 14, 25);
        doc.text(`Total Users: ${totalUsers}`, 14, 32);
        doc.text(`Total Orders: ${totalOrders}`, 14, 39);

        autoTable(doc, {
            startY: 45,
            head: [['Order ID', 'Amount (৳)', 'Date']],
            body: orders.map(order => [order._id, order.amount, new Date(order.createdAt).toLocaleDateString()]) || [],
        });

        doc.text('Top Selling Products:', 14, doc.lastAutoTable.finalY + 10);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Product Name', 'Quantity Sold', 'Price (৳)']],
            body: sortedTopSelling.map(product => [product.productId.name, product.quantity, product.price]) || [],
        });

        doc.save('Admin_Sales_Report.pdf');
    };
    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen space-y-6">
            {/* Page Header */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-400">Admin Reports</h1>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <FaChartPie size={30} className="text-blue-500 mr-4" />
                    <div>
                        <p className="text-gray-400">Total Sales</p>
                        <h2 className="text-xl font-bold">৳{orders ? orders.reduce((total, order) => total + order.amount, 0) : '0'}</h2> {/* Total revenue calculation */}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <FaUsers size={30} className="text-green-500 mr-4" />
                    <div>
                        <p className="text-gray-400">Total Users</p>
                        <h2 className="text-xl font-bold">{users?.length}</h2>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <FaShoppingCart size={30} className="text-yellow-500 mr-4" />
                    <div>
                        <p className="text-gray-400">Orders</p>
                        <h2 className="text-xl font-bold">{orders?.length}</h2>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <FaFileAlt size={30} className="text-red-500 mr-4" />
                    <div>
                        <p className="text-gray-400">Pending Reports</p>
                        <h2 className="text-xl font-bold">8</h2>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Sales Overview</h2>
                <div className="h-64 bg-gray-700 rounded-lg flex justify-center items-center">
                    {ordersLoading || usersLoading || productsLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <Line data={salesData} options={chartOptions} />
                    )}
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Top Selling Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedTopSelling?.slice(0, 5).map((product) => (
                        <div key={product._id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                            <img src={product?.productId.featuredImages} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                            <h3 className="text-lg font-semibold text-gray-200 mt-4">{product.name}</h3>
                            <p className="text-gray-400">Quantity Sold: {product.quantity}</p>
                            <p className="text-xl font-bold text-blue-400 mt-2">৳{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products?.map((product) => (
                        <div key={product._id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                            <img src={product?.featuredImages} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                            <h3 className="text-lg font-semibold text-gray-200 mt-4">{product.name}</h3>
                            <p className="text-gray-400">{product.description}</p>
                            <p className="text-xl font-bold text-blue-400 mt-2">৳{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Reports Table */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Admin Reports</h2>
            <button 
                onClick={generatePDF}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-4">
                Download Report (PDF)
            </button>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-gray-300">
                            <th className="py-4 px-4">Order ID</th>
                            <th className="py-4 px-4">Amount (৳)</th>
                            <th className="py-4 px-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map(order => (
                            <tr key={order._id} className="border-b border-gray-700">
                                <td className="py-4 px-4">{order._id}</td>
                                <td className="py-4 px-4">৳{order.amount}</td>
                                <td className="py-4 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default AdminReport;
