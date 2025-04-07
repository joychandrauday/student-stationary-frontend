/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/AdminManageProduct.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { Brand, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from "@/Redux/features/product/productApi";
import { IProduct } from "@/Interfaces/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import FilterDashboard from "@/pageComponent/Dashboard/ProductFilterDashboard";
import { useSearchParams } from "react-router-dom";
import ProductPagination from "@/pageComponent/product/ProductPagination";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useImageUpload from "@/Utils/useUplaodImages";
import LoadingPage from "@/pageComponent/Shared/LoadingPage";

const AdminManageProduct = () => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [updatedProduct, setUpdatedProduct] = useState<Partial<IProduct>>({});
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const { uploadImages, isLoading: isUploading } = useImageUpload();

    const [searchParams] = useSearchParams();

    const searchTerm = searchParams.get('searchTerm') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = (searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';
    const minRating = searchParams.get('minRating');
    const status = searchParams.get('status') || 'active';
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;

    const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;
    const parsedMinRating = minRating ? parseFloat(minRating) : undefined;

    const queryParams = {
        searchTerm,
        ...(category && category !== 'null' && { category }),
        ...(parsedMinPrice && !isNaN(parsedMinPrice) && { minPrice: parsedMinPrice }),
        ...(parsedMaxPrice && !isNaN(parsedMaxPrice) && { maxPrice: parsedMaxPrice }),
        ...(parsedMinRating && !isNaN(parsedMinRating) && { minRating: parsedMinRating }),
        ...(sortBy && { sortBy }),
        sortOrder,
        status,
        page,
        perPage: 9,
    };

    const { data, isLoading, refetch } = useGetProductsQuery(queryParams);
    const { products, meta } = data || {};
    const totalPages = meta?.totalPages || 1;

    const handleDelete = async (id: string) => {
        const { value: confirm } = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm) {
            try {
                await deleteProduct(id);
                toast.success('Product deleted successfully!');
                refetch();
            } catch (err) {
                toast.error('Failed to delete product');
            }
        }
    };

    const handleEditClick = (product: IProduct) => {
        setSelectedProduct(product);
        setUpdatedProduct(product);
        setEditModalOpen(true);
    };

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
    };

    const isBrand = (brand: string | Brand | { name: string }): brand is Brand | { name: string } => {
        return typeof brand !== "string";
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedImages = await uploadImages(e.target.files);
            if (uploadedImages.length > 0) {
                setUpdatedProduct((prev) => ({
                    ...prev,
                    // Concatenate previous images with the newly uploaded images
                    images: [...(prev.images || []), ...uploadedImages],
                }));
                toast.success('Images uploaded successfully!');
            }
        }
    };


    const handleDeleteImage = (index: number) => {
        setUpdatedProduct((prev) => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };
    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedImage = await uploadImages(e.target.files);
            if (uploadedImage.length > 0) {
                setUpdatedProduct((prev) => ({
                    ...prev,
                    featuredImages: uploadedImage[0], // Only the first image is set as the featured image
                }));
                toast.success('Featured image uploaded successfully!');
            }
        }
    };

    const handleUpdateSubmit = async () => {
        if (selectedProduct) {
            try {
                await updateProduct({ productId: selectedProduct._id as string, updatedProduct });
                setEditModalOpen(false);
                refetch();
                toast.success('Product updated successfully!');
            } catch (err) {
                toast.error('Failed to update product');
            }
        }
    };

    if (isLoading) return <LoadingPage />;

    return (
        <div className="max-w-7xl mx-auto rounded-none md:p-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center mb-4">Manage Products</CardTitle>
                    <FilterDashboard />
                </CardHeader>
                <CardContent>
                    <Table className="w-full border">
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price (BDT)</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Discount(%)</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products && products.map((product: IProduct, index: number) => (
                                <TableRow key={product._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.status}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{isBrand(product.brand) ? product.brand.name : product.brand}</TableCell>
                                    <TableCell>{product.quantity === 0 ? <span className="bg-red-700 animate-pulse text-white rounded-full">{product.quantity}</span> : product.quantity}</TableCell>
                                    <TableCell>{product.discount}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id as string)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <ProductPagination totalPage={totalPages} />
                </CardContent>
            </Card>

            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen} >
                <DialogContent className="max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4 h-auto">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    name="name"
                                    value={updatedProduct?.name || ""}
                                    onChange={handleUpdateChange}
                                />
                            </div>
                            <div>
                                <Label>Quantity</Label>
                                <Input
                                    name="quantity"
                                    type="number"
                                    value={updatedProduct?.quantity || 0}
                                    onChange={handleUpdateChange}
                                />
                            </div>

                            <div>
                                <Label>Price (BDT)</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={updatedProduct?.price || ""}
                                    onChange={handleUpdateChange}
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input name="description" value={updatedProduct?.description || ""} onChange={handleUpdateChange} />
                            </div>
                            <div className="flex gap-4 justify-between">
                                <div className="wrap">

                                    <Label>Featured Image</Label>
                                    <Input type="file" onChange={handleFeaturedImageUpload} />
                                </div>
                                {updatedProduct.featuredImages && (
                                    <div className="mt-2 border shadow p-2">
                                        <img src={updatedProduct.featuredImages} alt="Featured" className="w-20 h-20 object-cover rounded-md" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="wrap flex gap-2">

                                    {updatedProduct.images?.map((img, index) => (
                                        <div key={index} className="relative border shadow p-2">
                                            <img src={img} alt="Product" className="w-20 h-20 object-cover rounded-md" />
                                            <button onClick={() => handleDeleteImage(index)} className="absolute top-0 right-0 flex justify-center items-center font-bold w-5 h-5 bg-red-500 text-white rounded-full p-1">x</button>
                                        </div>
                                    ))}
                                </div>
                                <Label>Upload Images</Label>
                                <Input type="file" multiple onChange={handleImageUpload} />
                            </div>

                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateSubmit} disabled={isUploading}>{isUploading ? "Uplaoding Image" : "Save Changes"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default AdminManageProduct;
