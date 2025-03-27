import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddProductMutation } from "@/Redux/features/product/productApi";
import toast from "react-hot-toast";
import { useGetcategoryQuery } from "@/Redux/features/Category/categoryApi";
import { useGetBrandQuery } from "@/Redux/features/brand/brandApi";

// Dummy image upload function
const useImageUpload = () => {
    const uploadImages = async (files: FileList | null) => {
        // Simulate an image upload and return URLs (you should replace this with actual API call)
        if (!files) return [];
        return Array.from(files).map((file) => URL.createObjectURL(file)); // Just returning local URLs for demonstration
    };

    return {
        uploadImages,
        isLoading: false,
        error: null,
    };
};

// Define the form data type
interface ProductFormData {
    name: string;
    brand: string;
    price: number;
    category: string;
    description: string;
    images: Array<{ id: string; url: string }>;
    featuredImages: string;
    quantity: number;
    inStock: boolean;
}

const AdminAddProduct: React.FC = () => {
    const { uploadImages, isLoading: isImageUploading, error: imageUploadError } = useImageUpload();
    const { data: categories } = useGetcategoryQuery();
    const { data: brands } = useGetBrandQuery();
    const [addProduct, { isLoading }] = useAddProductMutation();
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>({
        defaultValues: {
            name: "",
            brand: "",
            price: 0,
            category: "",
            description: "",
            images: [{ id: "", url: "" }],
            featuredImages: "",
            quantity: 0,
            inStock: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "images" as const,
    });

    // Handle the featured image upload
    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedUrls = await uploadImages(e.target.files);
            if (uploadedUrls.length > 0) {
                setValue("featuredImages", uploadedUrls[0]); // Set the featured image URL
            }
        }
    };

    // Handle additional images upload for each field
    const handleAdditionalImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedUrls = await uploadImages(e.target.files);
            if (uploadedUrls.length > 0) {
                const newImages = [...fields];
                newImages[index].url = uploadedUrls[0]; // Update the specific image URL
                setValue("images", newImages); // Update the images field
            }
        }
    };
    const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
        try {
            // Create the payload with only the necessary fields
            const productPayload = {
                name: data.name,
                brand: data.brand,
                price: data.price,
                category: data.category,
                description: data.description,
                featuredImages: data.featuredImages,
                quantity: data.quantity,
                inStock: data.inStock,
                images: data.images.map((image) => image.url),
                status: "featured",  // Ensure status is one of "sale", "featured", or "hot"
                discount: 0,
                rating: 0,
                offerPrice: data.price,
            };

            // Call the addProduct mutation with the formatted data
            const response = await addProduct(productPayload).unwrap();

            if (response.success) {
                toast.success("Product added successfully!");
                reset();  // Reset the form after successful submission
            }
        } catch (error) {
            console.error("Error Adding Product:", error);
            toast.error("There was an error adding the product.");
        }
    };



    return (
        <div className="max-w-6xl mx-auto p-6">
            <Card className="shadow-lg rounded-none">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Name</label>
                            <Input
                                type="text"
                                placeholder="Enter product name"
                                {...register("name", { required: "Product Name is required" })}
                                className="rounded-none"
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Price (in BDT)</label>
                            <Input
                                type="number"
                                placeholder="Enter price"
                                {...register("price", { required: "Price is required", valueAsNumber: true })}
                                className="rounded-none"
                            />
                            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                        </div>
                        {/* quantity */}
                        <div>
                            <label className="block text-sm font-medium mb-2">quantity</label>
                            <Input
                                type="number"
                                placeholder="Enter quantity"
                                {...register("quantity", { required: "quantity is required", valueAsNumber: true })}
                                className="rounded-none"
                            />
                            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <div>
                                <select
                                    {...register("category", { required: "Category is required" })}
                                    className="w-full p-2 border rounded-none"
                                >
                                    <option value="">Select category</option>
                                    {categories &&
                                        categories.map((category, index) => (
                                            <option key={index} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                </select>
                                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
                            </div>
                        </div>
                        {/* brand */}
                        <div>
                            <label className="block text-sm font-medium mb-2">brand</label>
                            <div>
                                <select
                                    {...register("brand", { required: "brand is required" })}
                                    className="w-full p-2 border rounded-none"
                                >
                                    <option value="">Select brand</option>
                                    {brands &&
                                        brands.map((brand, index) => (
                                            <option key={index} value={brand._id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                </select>
                                {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand.message}</p>}
                            </div>
                        </div>

                        {/* Featured Image Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Featured Image</label>
                            <input
                                type="file"
                                name="featuredImages"
                                id="featuredImages"
                                onChange={handleFeaturedImageUpload}
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {isImageUploading && <p className="text-green-500 text-sm mt-2">Finishing uploading...</p>}
                            {imageUploadError && <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>}
                            {watch("featuredImages") && (
                                <div className="mt-4">
                                    <img src={watch("featuredImages")} alt="Featured" className="w-20 h-20 rounded-full object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Textarea
                                placeholder="Enter product description"
                                {...register("description", { required: "Description is required" })}
                                className="rounded-none"
                            />
                            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                        </div>

                        {/* Additional Images */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Additional Images</label>
                            {fields.map((field, index: number) => (
                                <div key={field.id} className="flex items-center space-x-4 mb-2">
                                    <input
                                        type="file"
                                        onChange={(e) => handleAdditionalImageUpload(index, e)}
                                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    {field.url && (
                                        <div className="mt-4">
                                            <img src={field.url} alt={`Additional Image ${index}`} className="w-20 h-20 rounded-full object-cover" />
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="rounded-none bg-primary-foreground text-white hover:bg-primary"
                                        onClick={() => remove(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => append({ id: "", url: "" })}
                                className="mt-2 rounded-none bg-primary-foreground text-white hover:bg-primary"
                            >
                                Add Image URL
                            </Button>
                        </div>

                        {/* In Stock */}
                        <div className="flex items-center space-x-4">
                            <label className="block text-sm font-medium">In Stock</label>
                            <Switch
                                checked={watch("inStock")}
                                onCheckedChange={(checked) => setValue("inStock", checked)}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <Button
                                type="submit"
                                className="w-full bg-primary-foreground rounded-none text-white hover:bg-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? "Adding Product..." : "Add Product"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAddProduct;
