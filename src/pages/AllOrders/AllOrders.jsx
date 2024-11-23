import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchOrders = async () => {
  const response = await axios.get("http://localhost:3000/api/orders");
  return response.data.data; // Assuming the API returns orders in `data.data`
};

const AllOrders = () => {
  const [revenue, setRevenue] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/orders/revenue")
      .then((response) => {
        console.log(response);
        setRevenue(response.data.data.totalRevenue); // Assuming data is in `data.data`
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (isError) {
    return <div>Error fetching orders: {error.message}</div>;
  }
  console.log(revenue);
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white table-zebra">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Product ID</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Total Price</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">{order.email}</td>
                  <td className="px-4 py-2 border">{order.product}</td>
                  <td className="px-4 py-2 border">{order.quantity}</td>
                  <td className="px-4 py-2 border">${order.totalPrice}</td>
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {/* Total Revenue Row */}
              <tr className="bg-gray-200 font-bold">
                <td colSpan="4" className="px-4 py-2 border text-right ">
                  Total Revenue
                </td>
                <td className="px-4 py-2 border bg-yellow-400">${revenue}</td>
                <td className="px-4 py-2 border"></td>{" "}
                {/* Empty cell for Date */}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
