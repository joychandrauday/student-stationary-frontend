import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from "@/Redux/features/product/productApi";
import { IProduct } from "@/Interfaces/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
const AdminManageProduct = () => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [updatedProduct, setUpdatedProduct] = useState<Partial<IProduct>>({});
    const [updateProduct] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()
    const [filters, setFilters] = useState({
        searchTerm: "",
        categoryFilter: "",
        inStockFilter: "all",
        sortBy: "",
        sortOrder: "asc",
        page: 1,
        minPrice: 0,
        maxPrice: 1000, // Set a default max price limit (adjust as needed)
    });

    const { searchTerm, categoryFilter, inStockFilter, sortBy, sortOrder, minPrice, maxPrice } = filters;

    const inStockParam = inStockFilter === "all" ? undefined : inStockFilter === "inStock" ? "true" : "false";

    interface Meta {
        totalPages: number;
    }

    interface UseGetProductsQueryResult {
        data: IProduct[];
        isLoading: boolean;
        error: boolean;
        meta: Meta;
    }

    const { data: products = [], isLoading, error, meta, refetch } = useGetProductsQuery<UseGetProductsQueryResult>({
        name: searchTerm || undefined,
        category: categoryFilter || undefined,
        inStock: inStockParam === "true" ? true : inStockParam === "false" ? false : undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
        page: filters.page,
        minPrice,
        maxPrice,
    });

    const totalPages = meta?.totalPages || 1;

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                page: newPage,
            }));
        }
    };

    const categories = ["Writing", "Office", "Art", "Educational", "Technology", "Others"];



    // ...
    const handleDelete = async (id: string) => {
        // swal2 to confirmation delete 

        const { value: confirm } = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm) {
            await deleteProduct(id);
            toast.success('Product deleted successfully!');
            refetch();
        }
    };

    // ...

    const handleEditClick = (product: IProduct) => {
        setSelectedProduct(product);
        setUpdatedProduct(product);
        setEditModalOpen(true);
    };

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async () => {
        if (selectedProduct) {
            await updateProduct({ productId: selectedProduct._id, updatedProduct });
            setEditModalOpen(false);
            refetch()
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching products.</p>;

    return (
        <div className="max-w-7xl mx-auto rounded-none p-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Manage Products</CardTitle>
                    {/* Search and Filter Section */}
                    <div className="flex items-center justify-between mb-6 bg-primary p-4 ">
                        <div className="flex space-x-4">
                            {/* Search Input */}
                            <Input
                                type="text"
                                placeholder="Search by product name..."
                                className="w-1/4 bg-primary-foreground text-white border-none focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={handleFilterChange}
                                name="searchTerm"
                            />
                            {/* Category Filter */}
                            <select
                                className="select select-bordered w-1/4 bg-primary-foreground text-white border-none focus:ring-2 focus:ring-primary"
                                value={categoryFilter}
                                onChange={handleFilterChange}
                                name="categoryFilter"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category} className="bg-primary-foreground hover:bg-primary">
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {/* In Stock Filter */}
                            <select
                                className="select select-bordered w-1/4 bg-primary-foreground text-white border-none focus:ring-2 focus:ring-primary"
                                value={inStockFilter}
                                onChange={handleFilterChange}
                                name="inStockFilter"
                            >
                                <option value="all">All Stock Status</option>
                                <option value="inStock">In Stock</option>
                                <option value="outOfStock">Out of Stock</option>
                            </select>
                            {/* Sort By Filter */}
                            <select
                                className="select select-bordered w-1/4 bg-primary-foreground text-white border-none focus:ring-2 focus:ring-primary"
                                value={sortBy}
                                onChange={handleFilterChange}
                                name="sortBy"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price">Sort by Price</option>
                            </select>
                            {/* Sort Order Filter */}
                            <select
                                className="select select-bordered w-1/4 bg-primary-foreground text-white border-none focus:ring-2 focus:ring-primary"
                                value={sortOrder}
                                onChange={handleFilterChange}
                                name="sortOrder"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>

                        {/* Price Range Slider */}
                        <div className="flex items-center flex-col mx-4 mt-4">
                            <span className="text-white">Min Range: {minPrice} BDT</span>
                            <input
                                type="range"
                                min="0"
                                max="5555"
                                step="10"
                                value={minPrice}
                                onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))}
                                className="w-full bg-primary-foreground text-white focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="range"
                                min="0"
                                max="5555"
                                step="10"
                                value={maxPrice}
                                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                                className="w-full bg-primary-foreground text-white focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-white">Max Price: {maxPrice} BDT</span>
                        </div>
                    </div>


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
                                <TableHead>discount(%)</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index: number) => (
                                <TableRow key={product._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.status}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
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
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-between items-center mt-4">
                        <Button disabled={filters.page === 1} onClick={() => handlePageChange(filters.page - 1)}>
                            Previous
                        </Button>
                        <div className="text-sm font-medium">
                            Page {filters.page} of {totalPages}
                        </div>
                        <Button disabled={filters.page === totalPages} onClick={() => handlePageChange(filters.page + 1)}>
                            Next
                        </Button>
                    </div>
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
                                    value={updatedProduct.name || ""}
                                    onChange={handleUpdateChange}
                                />
                            </div>
                            <div>
                                <Label>quantity</Label>
                                <Input
                                    name="quantity"
                                    type="number"
                                    value={updatedProduct.quantity || 0}
                                    onChange={handleUpdateChange}
                                />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Input
                                    name="status"
                                    type="text"
                                    value={updatedProduct.status || 'featured'}
                                    onChange={handleUpdateChange}
                                    list="quantity-options" // Connects the input to the datalist
                                />
                                <datalist id="quantity-options">
                                    <option value="sale" />
                                    <option value="hot" />
                                </datalist>
                            </div>

                            <div>
                                <Label>Price (BDT)</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={updatedProduct.price || ""}
                                    onChange={handleUpdateChange}
                                />
                            </div>
                            <div>
                                <Label>discount(%)</Label>
                                <Input
                                    name="discount"
                                    value={updatedProduct.discount || 0}
                                    onChange={handleUpdateChange}
                                />
                            </div>
                            <div>
                                <Label>In Stock</Label>
                                <Input
                                    name="discount"
                                    type='checkbox'
                                    value={updatedProduct.inStock ? 'true' : 'false'}
                                    onChange={handleUpdateChange}
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
        </div >
    );
};

export default AdminManageProduct;
