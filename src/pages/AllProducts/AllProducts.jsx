import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const fetchProducts = async () => {
  const response = await axios.get("https://student-stationary-backend.vercel.app/api/products"); // Update with your API endpoint
  return response.data;
};

const AllProducts = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  if (isLoading) {
    return <div className="text-center mt-10 text-lg">Loading products...</div>;
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-lg text-red-500">
        Error fetching products: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.data.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:-translate-y-1 cursor-pointer transform transition-all duration-200 relative"
          >
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 ">
              <h3 className="text-lg font-semibold truncate">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-sm text-gray-800 font-medium">
                $ {product.price}
              </p>
              <p className="text-sm font-semibold absolute right-0 top-0 badge-primary">{product.quantity} left only.</p>
              <div className="bg-blue-500 hover:bg-blue-600 w-full text-center rounded-md py-2 mt-3">
                <Link
                  to={`/product/${product._id}`}
                  className=" w-full text-white  "
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
