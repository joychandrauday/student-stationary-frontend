import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddProductMutation } from "@/Redux/features/product/productApi";
import toast from "react-hot-toast";

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

    const categories = [
        "Writing",
        "Office",
        "Art",
        "Educational",
        "Technology",
        "Others",
    ];

    // Handle form submission
    const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
        try {
            const response = await addProduct({
                ...data,
                images: data.images.map(image => image.url)
            }).unwrap();
            if (response.success) {
                toast.success('Product added successfully!!');
                reset(); // Reset the form after successful submission
            }
        } catch (error) {
            console.error("Error Adding Product:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Card className="shadow-lg rounded-none">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">
                        Add New Product
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Product Name
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter product name"
                                {...register("name", { required: "Product Name is required" })}
                                className="rounded-none"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Brand</label>
                            <Input
                                type="text"
                                placeholder="Enter brand name"
                                {...register("brand", { required: "Brand is required" })}
                                className="rounded-none"
                            />
                            {errors.brand && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.brand.message}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Price (in BDT)
                            </label>
                            <Input
                                type="number"
                                placeholder="Enter price"
                                {...register("price", {
                                    required: "Price is required",
                                    valueAsNumber: true,
                                })}
                                className="rounded-none"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.price.message}
                                </p>
                            )}
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
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            {errors.category && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Quantity</label>
                            <Input
                                type="number"
                                placeholder="Enter quantity"
                                {...register("quantity", {
                                    required: "Quantity is required",
                                    valueAsNumber: true,
                                })}
                                className="rounded-none"
                            />
                            {errors.quantity && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.quantity.message}
                                </p>
                            )}
                        </div>

                        {/* Featured Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Featured Image URL
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter featured image URL"
                                {...register("featuredImages", {
                                    required: "Featured Image URL is required",
                                })}
                                className="rounded-none"
                            />
                            {errors.featuredImages && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.featuredImages.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <Textarea
                                placeholder="Enter product description"
                                {...register("description", {
                                    required: "Description is required",
                                })}
                                className="rounded-none"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Additional Images */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Additional Image URLs
                            </label>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-4 mb-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter image URL"
                                        {...register(`images.${index}`, {
                                            required: "Image URL is required",
                                        })}
                                        className="rounded-none"
                                    />
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
