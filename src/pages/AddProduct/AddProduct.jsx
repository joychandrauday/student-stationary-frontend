import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/products",
        data
      );
      if (response.status === 201) {
        toast.success("Product added successfully");
        navigate("/all-products"); // Redirect to the product list page
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to add product");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full mx-auto p-6 bg-white shadow-lg shadow-gray-600 rounded-md mt-12
    "
    >
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <div className="flex gap-4">
          <div className="wrapp w-full">
            <div>
              <label className="block font-medium">Product Name</label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                className="w-full p-2 border rounded-md"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Brand</label>
              <input
                type="text"
                {...register("brand", { required: "Brand is required" })}
                className="w-full p-2 border rounded-md"
              />
              {errors.brand && (
                <p className="text-red-500">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Price</label>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                className="w-full p-2 border rounded-md"
              />
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full mt-4 p-2 bg-blue-500 text-white rounded-md ${
                isSubmitting ? "bg-blue-300 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Product"}
            </button>
          </div>

          <div className="wrapp w-full">
            <div>
              <label className="block font-medium">Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Writing">Writing</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Art Supplies">Art Supplies</option>
                <option value="Educational">Educational</option>
                <option value="Technology">Technology</option>
              </select>
              {errors.category && (
                <p className="text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full p-2 border rounded-md"
              ></textarea>
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Quantity</label>
              <input
                type="number"
                {...register("quantity", { required: "Quantity is required" })}
                className="w-full p-2 border rounded-md"
              />
              {errors.quantity && (
                <p className="text-red-500">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register("inStock")}
                  className="mr-2"
                />
                In Stock
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
