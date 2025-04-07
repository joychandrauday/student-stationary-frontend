import { ICategory } from "@/Interfaces/types";
import LoadingPage from "@/pageComponent/Shared/LoadingPage";
import { useAddcategoryMutation, useDeletecategoryMutation, useGetcategoryQuery, useUpdatecategoryMutation } from "@/Redux/features/Category/categoryApi";
import useImageUpload from "@/Utils/useUplaodImages";
import React, { useState } from "react";

const AdminManageCategory = () => {
    // State for new category form
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
        icon: "",
    });

    // State for editing category
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    const { data: categories = [], isLoading, isError } = useGetcategoryQuery();
    const [addCategory, { isLoading: isAdding, isSuccess: isAddingSuccess }] = useAddcategoryMutation();
    const [updateCategory, { isLoading: isUpdating, isSuccess: isUpdatingSuccess }] = useUpdatecategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeletecategoryMutation();

    // Use image upload hook
    const { uploadImages, isLoading: isImageUploading, error: imageUploadError } = useImageUpload();

    // Handle new category form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image file selection and upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedUrls = await uploadImages(e.target.files);
            if (uploadedUrls.length > 0) {
                setNewCategory((prev) => ({
                    ...prev,
                    icon: uploadedUrls[0], // Set the first image URL as the category icon
                }));
            }
        }
    };

    // Handle category submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            // Update category if we are editing
            await updateCategory({
                categoryId: editingCategory._id, // Ensure _id is a string, not undefined
                updatedCategory: newCategory,
            });
        } else {
            // Add new category if we are creating
            await addCategory(newCategory);
        }
        // Reset form after submission
        setNewCategory({ name: "", description: "", icon: "" });
        setEditingCategory(null);
    };

    // Set category for editing
    const handleEdit = (category: ICategory) => {
        setEditingCategory(category);
        setNewCategory({
            name: category.name,
            description: category.description,
            icon: category.icon,
        });
    };

    // Handle category deletion
    const handleDelete = async (categoryId: string | undefined) => {
        if (categoryId) {
            await deleteCategory(categoryId); // Ensure categoryId is not undefined
        }
    }

    if (isLoading) return <LoadingPage />;
    if (isError) return <div className="text-center text-red-500 py-12">Error fetching categories</div>;

    return (
        <div className="container mx-auto px-6 py-12">
            <h2 className="text-3xl font-semibold text-center my-6">Manage Categories</h2>

            {/* New or Edit Category Form */}
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={newCategory.name}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter category name"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={newCategory.description}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter category description"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Category Icon</label>
                        <input
                            type="file"
                            name="icon"
                            id="icon"
                            onChange={handleImageUpload}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {imageUploadError && <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>}
                        {newCategory.icon && (
                            <div className="mt-4">
                                <img src={newCategory.icon} alt="Category Icon" className="w-20 h-20 rounded-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isAdding || isUpdating || isImageUploading}
                        >
                            {editingCategory ? (isUpdating ? "Updating..." : "Update Category") : (isAdding ? "Adding..." : "Add Category")}
                        </button>
                    </div>
                </form>
                {isAddingSuccess || isUpdatingSuccess ? (
                    <div className="text-green-500 text-center mt-4">Category saved successfully!</div>
                ) : null}
            </div>

            {/* Category Table */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full table-auto text-sm text-left text-gray-500">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Category Name</th>
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
                            categories.map((category) => (
                                <tr key={category._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{category.name}</td>
                                    <td className="px-4 py-2">{category.description}</td>
                                    <td className="px-4 py-2">
                                        {category.icon ? (
                                            <img src={category.icon} alt={category.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <span className="text-gray-400">No icon</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-around">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="px-4 py-2 bg-transparent text-black border rounded-lg "
                                            >
                                                Edit
                                            </button>
                                            {
                                                category._id &&
                                                <button
                                                    onClick={() => handleDelete(category?._id)}
                                                    className="px-4 py-2 bg-red-700  text-white rounded-lg "
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </button>
                                            }
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

export default AdminManageCategory;
