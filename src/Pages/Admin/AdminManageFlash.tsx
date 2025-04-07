/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductPagination from "@/pageComponent/product/ProductPagination";
import toast from "react-hot-toast";
import LoadingPage from "@/pageComponent/Shared/LoadingPage";

const AddFlashSale = () => {
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch products from API
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://studentstationary-backend.vercel.app/api/v1/products");
            const data = await response.json();
            setProducts(data.data.products);
        } catch (error) {
            toast.error("Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        if (e.target.checked) {
            setSelectedProductIds((prev) => [...prev, productId]);
        } else {
            setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
        }
    };

    const handleApplyDiscount = async () => {
        if (selectedProductIds.length === 0) {
            toast.error("Please select at least one product.");
            return;
        }

        setLoading(true);
        const data = { products: selectedProductIds, discountPercentage };

        try {
            const response = await fetch("https://studentstationary-backend.vercel.app/api/v1/flash-sale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success("Discount applied successfully!");
                fetchProducts(); // Refresh products
            } else {
                toast.error("Failed to apply discount.");
            }
        } catch (error) {
            toast.error("Error applying discount.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDis = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`https://studentstationary-backend.vercel.app/api/v1/flash-sale/remove/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Discount removed successfully!");
                fetchProducts(); // Refresh products
            } else {
                toast.error("Failed to remove discount.");
            }
        } catch (error) {
            toast.error("Error removing discount.");
        } finally {
            setLoading(false);
        }
    };
    const discountPercentageSingle = (productPrice: number | string, offerPrice: number | string) => {
        if (!productPrice || !offerPrice || isNaN(Number(productPrice)) || isNaN(Number(offerPrice))) {
            return 0;
        }

        return Math.round(((Number(productPrice) - Number(offerPrice)) / Number(productPrice)) * 100);
    };

    if (loading) {
        <LoadingPage />
    }
    return (
        <div className="wrap overflow-x-auto p-4">

            <div className="overflow-x-auto table-auto w-full">
                <table className="w-full min-w-[700px] border border-gray-300">
                    <thead>
                        <tr>
                            <th className="p-2 text-sm md:text-base border">Select</th>
                            <th className="p-2 text-sm md:text-base border">Title</th>
                            <th className="p-2 text-sm md:text-base border">Price</th>
                            <th className="p-2 text-sm md:text-base border">Offer Price</th>
                            <th className="p-2 text-sm md:text-base border">Discount (%)</th>
                            <th className="p-2 text-sm md:text-base border">Status</th>
                            <th className="p-2 text-sm md:text-base border">Quantity</th>
                            <th className="p-2 text-sm md:text-base border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.length > 0 ? (
                            products.map((listing) => (
                                <tr key={listing._id} className="text-xs md:text-sm border">
                                    <td className="p-2 border">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => handleCheckboxChange(e, listing._id)}
                                            checked={selectedProductIds.includes(listing._id)}
                                        />
                                    </td>
                                    <td className="p-2 border">{listing.name.slice(0, 30)}...</td>
                                    <td className="p-2 border">৳{listing.price}</td>
                                    <td className="p-2 border">৳{listing.offerPrice.toFixed(2)}</td>
                                    <td className="p-2 border">
                                        {listing.offerPrice > 0 ? discountPercentageSingle(listing.price, listing.offerPrice
                                        ) : "0"}%
                                    </td>
                                    <td className="p-2 border">{listing.status}</td>
                                    <td className="p-2 border">{listing.quantity}</td>
                                    <td className="p-2 border">
                                        {listing.offerPrice ? (
                                            <button
                                                className="bg-red-600 text-white p-2 rounded"
                                                onClick={() => handleRemoveDis(listing._id)}
                                            >
                                                Remove discount
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-4 text-xs md:text-sm border">
                                    No listings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <ProductPagination totalPage={2} />
            </div>

            {/* Discount Section */}
            <div className="flex justify-between mt-4">
                <div>
                    <Label htmlFor="discount">Discount Percentage</Label>
                    <Input
                        type="number"
                        id="discount"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                        placeholder="Enter discount percentage"
                    />
                </div>
                <Button
                    onClick={handleApplyDiscount}
                    disabled={discountPercentage === 0}
                    className="bg-primary-foreground text-white hover:bg-primary">
                    {loading ? "Applying Discount" : "Apply Discount"}
                </Button>
            </div>
        </div>
    );
};

export default AddFlashSale;
