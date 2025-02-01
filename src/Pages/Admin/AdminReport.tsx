import { FaChartPie, FaUsers, FaShoppingCart } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useAllOrdersQuery } from '@/Redux/features/order/orderApi';
import { subMonths, format } from "date-fns";
import { useGetUsersQuery } from '@/Redux/features/user/userApi';
import { IOrder, useAllUsersQuery } from '@/Interfaces/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/studentstationarylogo.png'
import { useState } from 'react';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
interface useAllOrdersQuery {
    data: IOrder[];
    isLoading: boolean;
    error: boolean;
}
const AdminReport = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // ✅ Optional, but useful for initial load
    const [selectedMonth, setSelectedMonth] = useState<number | "all">(currentMonth);

    const getMonthStartAndEndDate = (year: number, month: number) => {
        return {
            startDate: new Date(year, month - 1, 1).toISOString().split("T")[0],
            endDate: new Date(year, month, 0).toISOString().split("T")[0],
        };
    };

    const dateFilter =
        selectedMonth === "all"
            ? undefined
            : getMonthStartAndEndDate(currentYear, selectedMonth);


    const monthNames: Record<number, string> = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    };

    // API Call
    const { data: orders } = useAllOrdersQuery<useAllOrdersQuery>(dateFilter || {});

    const { data: users } = useGetUsersQuery<useAllUsersQuery>({});
    console.log(dateFilter);
    // Sales data for the chart (Dynamic sales data based on the orders)

    const lastFourMonths = Array.from({ length: 4 }, (_, i) =>
        format(subMonths(new Date(), i), "MMMM")
    ).reverse();

    // গত ৪ মাসের sales data বের করা
    const filteredSalesData = lastFourMonths.map(month => {
        const monthlyOrders = orders?.filter(order =>
            format(new Date(order.orderDate), "MMMM") === month
        );
        return monthlyOrders?.reduce((sum, order) => sum + order.amount, 0) || 0;
    });

    // salesData আপডেট
    const salesData = {
        labels: lastFourMonths,
        datasets: [
            {
                label: 'Sales Overview',
                data: filteredSalesData,
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
            name: string;
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
        doc.text(`Admin Sales Report(${selectedMonth === "all" ? "All Months" : monthNames[selectedMonth]})`, 14, 15);

        const totalSales = orders.reduce((total: number, order: IOrder) => total + order.amount, 0) || 0;
        const totalUsers = users.length || 0;
        const totalOrders = orders.length || 0;

        doc.setFontSize(12);
        doc.text(`Total Sales: Taka ${totalSales}`, 14, 25);
        doc.text(`Total Users: ${totalUsers}`, 14, 32);
        doc.text(`Total Orders: ${totalOrders}`, 14, 39);

        let finalY = 45;

        autoTable(doc, {
            startY: finalY,
            head: [['Order ID', 'Amount (taka)', 'Date']],
            body: orders.map(order => [order.transaction.id, order.amount, new Date(order.createdAt).toLocaleDateString()]) || [],
            didDrawPage: (data) => {
                if (data.cursor) {
                    finalY = data.cursor.y;
                }
            }
        });

        doc.text('Top Selling Products:', 14, finalY + 10);

        autoTable(doc, {
            startY: finalY + 15,
            head: [['Product Name', 'Quantity Sold', 'Price (৳)']],
            body: sortedTopSelling.map(product => [product.productId.name, product.quantity, product.price]) || [],
        });

        doc.save('Admin_Sales_Report.pdf');
    };


    return (
        <div className="p-6 min-h-screen space-y-6 bg-white text-black">
            {/* Page Header */}
            <header className="flex justify-between md:items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Admin Reports</h1>
                <div className="wrap">
                    <div className="mb-4">
                        <div className="wrap">
                            <label className="block mb-2 font-medium text-gray-300">Select Month:</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value === "all" ? "all" : Number(e.target.value))
                                }
                                className="border border-gray-500 p-2   py-2 px-4 mr-2 text-primary hover:bg-primary hover:text-white"
                            >
                                <option value="all">All Orders</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>
                                        {new Date(currentYear, month - 1).toLocaleString("default", {
                                            month: "long",
                                        })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={generatePDF}
                            className="bg-primary hover:bg-gray-600 text-white py-2 px-4 ">
                            Download Report
                        </button>
                    </div>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-transparent text-primary hover:shadow-lg hover:border cursor-pointer p-6  shadow-md flex items-center">
                    <FaChartPie size={30} className="text-primary mr-4" />
                    <div>
                        <p className="text-primary">Total Sales</p>
                        <h2 className="text-xl font-bold text-primary">৳{orders ? orders.reduce((total, order) => total + order.amount, 0) : '0'}</h2>
                    </div>
                </div>
                <div className="bg-transparent text-primary hover:shadow-lg hover:border cursor-pointer p-6  shadow-md flex items-center">
                    <FaUsers size={30} className="text-primary mr-4" />
                    <div>
                        <p className="text-primary">Total Users</p>
                        <h2 className="text-xl font-bold text-primary">{users?.length}</h2>
                    </div>
                </div>
                <div className="bg-transparent text-primary hover:shadow-lg hover:border cursor-pointer p-6  shadow-md flex items-center">
                    <FaShoppingCart size={30} className="text-primary mr-4" />
                    <div>
                        <p className="text-primary">Orders</p>
                        <h2 className="text-xl font-bold text-primary">{orders?.length}</h2>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="shadow-md p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Sales Overview</h2>
                <div className="h-64 bg-gray-800 flex justify-center items-center">

                    <Line data={salesData} options={chartOptions} />
                </div>
            </div>
            {/* Top Selling Products */}
            <div className="bg-white  shadow-md p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Top Selling Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedTopSelling?.slice(0, 5).map((product) => (
                        <div
                            key={product._id}
                            className="relative bg-gray-700 bg-opacity-20 p-4 backdrop-blur-lg shadow-lg border border-white/10 cursor-pointer overflow-hidden group"
                        >
                            {/* Shining Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="absolute -top-1/2 left-1/2 w-40 h-40 bg-white/80 rotate-45 blur-lg transition-transform duration-700 group-hover:translate-x-32 group-hover:translate-y-32"></div>
                            </div>

                            <img
                                src={product?.productId.featuredImages}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <h3 className="text-lg font-semibold text-primary mt-4">{product.productId.name}</h3>
                            <p className="text-primary">Quantity Sold: {product.quantity}</p>
                            <p className="text-xl font-bold text-primary mt-2">৳{product.price}</p>
                        </div>


                    ))}
                </div>
            </div>


        </div>

    );
};

export default AdminReport;
