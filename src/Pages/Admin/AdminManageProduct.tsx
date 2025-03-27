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

const AdminManageProduct = () => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [updatedProduct, setUpdatedProduct] = useState<Partial<IProduct>>({});
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();


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
    console.log(products);
    const totalPages = meta?.totalPages || 1


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

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
    };
    const isBrand = (brand: string | Brand | { name: string }): brand is Brand | { name: string } => {
        return typeof brand !== "string"; // It's either a Brand object or an inline object with 'name'
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

    if (isLoading) return <p>Loading...</p>;

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
                            {products && products?.map((product: IProduct, index: number) => (
                                <TableRow key={product._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.status}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>  {isBrand(product.brand) ? product.brand.name : product.brand}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            product.quantity === 0
                                                ? <div className="bg-red-700 animate-pulse text-center text-white rounded-full">{product.quantity}</div>
                                                : product.quantity
                                        }
                                    </TableCell>
                                    <TableCell>{product.discount}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditClick(product)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm"
                                            onClick={() => handleDelete(product._id as string)}
                                        >
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

            {/* Edit Product Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4">
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
                                <Label>Status</Label>
                                <select
                                    name="status"
                                    value={updatedProduct?.status || 'featured'}
                                    onChange={handleUpdateChange}
                                    className="w-full bg-primary-foreground text-white border-none rounded-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="sale">Sale</option>
                                    <option value="hot">Hot</option>
                                    <option value="featured">Featured</option>
                                </select>
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
                                <Label>Discount(%)</Label>
                                <Input
                                    name="discount"
                                    value={updatedProduct?.discount || 0}
                                    onChange={handleUpdateChange}
                                />
                            </div>
                            <div>
                                <Label>In Stock</Label>
                                <Input
                                    name="inStock"
                                    type="checkbox"
                                    checked={updatedProduct?.inStock || false}
                                    onChange={() => setUpdatedProduct((prev) => ({
                                        ...prev,
                                        inStock: !prev.inStock,
                                    }))}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminManageProduct;
