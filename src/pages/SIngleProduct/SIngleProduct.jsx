import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const fetchProduct = async (id) => {
  const response = await axios.get(`https://student-stationary-backend.vercel.app/api/products/${id}`);
  return response.data.data;
};

const SingleProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const [quantity, setQuantity] = useState(1); // State for order quantity
  const [email, setEmail] = useState(""); // State for email
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  const handleOrder = async () => {
    try {
      setIsSubmitting(true);
      const totalPrice = product.price * quantity; // Calculate total price dynamically
      const orderData = {
        email, // Get the email value from the state
        product: product._id,
        quantity,
        totalPrice,
      };

      const response = await axios.post(
        "https://student-stationary-backend.vercel.app/api/orders",
        orderData
      );
      toast.success("Order placed successfully!");
      refetch(); // Refresh product data (optional)
    } catch (err) {
      alert(`Failed to place order: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (isError) {
    return <div>Error fetching product: {error.message}</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.image || "https://via.placeholder.com/300"}
        alt={product.name}
        className="w-full h-64 object-cover rounded-lg shadow-lg"
      />
      <p className="text-gray-700 my-4">{product.description}</p>
      <p className="text-lg font-semibold">Category: {product.category}</p>
      <p className="text-lg font-semibold">Price: ${product.price}</p>
      <p className="text-lg font-semibold">
        Available Products: {product.quantity}
      </p>
      <p className="text-lg font-bold mt-2">
        Total Price: ${product.price * quantity}
      </p>
      <div className="mt-6 flex items-center space-x-4">
        <div className="flex-col flex">
          <label className="text-lg font-semibold">Quantity:</label>
          <input
            type="number"
            min="1"
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border rounded-md px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-semibold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Corrected email state update
            placeholder="Enter your email"
            className="w-60 border rounded-md px-2 py-1"
          />
        </div>
        <button
          onClick={handleOrder}
          disabled={isSubmitting || product.quantity < 1 || !email} // Check if email is empty
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } ${product.quantity < 1 || !email ? "cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Placing Order..." : "Order Now"}
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
