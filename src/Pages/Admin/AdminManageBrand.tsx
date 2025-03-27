
import { useAddBrandMutation, useDeleteBrandMutation, useGetBrandQuery, useUpdateBrandMutation } from "@/Redux/features/brand/brandApi";
import { Brand } from "@/Redux/features/product/productApi";
import useImageUpload from "@/Utils/useUplaodImages";
import React, { useState } from "react";

const AdminManageBrand = () => {
    // State for new Brand form
    const [newBrand, setNewBrand] = useState({
        name: "",
        description: "",
        icon: "",
    });

    // State for editing Brand
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const { data: categories = [], isLoading, isError } = useGetBrandQuery();
    const [addBrand, { isLoading: isAdding, isSuccess: isAddingSuccess }] = useAddBrandMutation();
    const [updateBrand, { isLoading: isUpdating, isSuccess: isUpdatingSuccess }] = useUpdateBrandMutation();
    const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

    // Use image upload hook
    const { uploadImages, isLoading: isImageUploading, error: imageUploadError } = useImageUpload();

    // Handle new Brand form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBrand((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image file selection and upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedUrls = await uploadImages(e.target.files);
            if (uploadedUrls.length > 0) {
                setNewBrand((prev) => ({
                    ...prev,
                    icon: uploadedUrls[0], // Set the first image URL as the Brand icon
                }));
            }
        }
    };

    // Handle Brand submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBrand) {
            // Update Brand if we are editing
            await updateBrand({
                BrandId: editingBrand._id as string,
                updatedBrand: newBrand,
            });
        } else {
            // Add new Brand if we are creating
            await addBrand(newBrand);
        }
        // Reset form after submission
        setNewBrand({ name: "", description: "", icon: "" });
        setEditingBrand(null);
    };

    // Set Brand for editing
    const handleEdit = (Brand: Brand) => {
        setEditingBrand(Brand);
        setNewBrand({
            name: Brand.name,
            description: Brand.description,
            icon: Brand.icon,
        });
    };

    // Handle Brand deletion
    const handleDelete = async (BrandId: string) => {
        await deleteBrand(BrandId);
    };

    if (isLoading) return <div className="text-center py-12">Loading...</div>;
    if (isError) return <div className="text-center text-red-500 py-12">Error fetching categories</div>;

    return (
        <div className="container mx-auto px-6 py-12">
            <h2 className="text-3xl font-semibold text-center my-6">Manage Categories</h2>

            {/* New or Edit Brand Form */}
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Brand Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={newBrand.name}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Brand name"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={newBrand.description}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Brand description"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Brand Icon</label>
                        <input
                            type="file"
                            name="icon"
                            id="icon"
                            onChange={handleImageUpload}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {imageUploadError && <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>}
                        {newBrand.icon && (
                            <div className="mt-4">
                                <img src={newBrand.icon} alt="Brand Icon" className="w-20 h-20 rounded-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isAdding || isUpdating || isImageUploading}
                        >
                            {editingBrand ? (isUpdating ? "Updating..." : "Update Brand") : (isAdding ? "Adding..." : "Add Brand")}
                        </button>
                    </div>
                </form>
                {isAddingSuccess || isUpdatingSuccess ? (
                    <div className="text-green-500 text-center mt-4">Brand saved successfully!</div>
                ) : null}
            </div>

            {/* Brand Table */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full table-auto text-sm text-left text-gray-500">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Brand Name</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Description</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Icon</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories && categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-500 py-6">No categories available</td>
                            </tr>
                        ) : (
                            categories.map((Brand) => (
                                <tr key={Brand._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{Brand.name}</td>
                                    <td className="px-4 py-2">{Brand.description.slice(0, 50)}...</td>
                                    <td className="px-4 py-2">
                                        {Brand.icon ? (
                                            <img src={Brand.icon} alt={Brand.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <span className="text-gray-400">No icon</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-around">
                                            <button
                                                onClick={() => handleEdit(Brand)}
                                                className="px-4 py-2 bg-transparent text-black border rounded-lg "
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(Brand._id as string)}
                                                className="px-4 py-2 bg-red-700  text-white rounded-lg "
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminManageBrand;
