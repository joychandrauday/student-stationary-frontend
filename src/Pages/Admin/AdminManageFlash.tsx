
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetProductsQuery } from "@/Redux/features/product/productApi";
import ProductPagination from "@/pageComponent/product/ProductPagination";
import toast from "react-hot-toast";

const AddFlashSale = () => {
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]); // Track selected product IDs
    const [discountPercentage, setDiscountPercentage] = useState<number>(0); // Track discount percentage

    // Fetch products via Redux API hook
    const { data: products } = useGetProductsQuery({});

    // Handle checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        if (e.target.checked) {
            setSelectedProductIds((prev) => [...prev, productId]);
        } else {
            setSelectedProductIds((prev) => prev.filter(id => id !== productId));
        }
    };

    // Handle Save changes (no longer necessary since we are using Redux)
    const handleApplyDiscount = async () => {
        if (selectedProductIds.length === 0) {
            toast.error("Please select at least one product.");
            return;
        }

        const data = {
            products: selectedProductIds,
            discountPercentage: discountPercentage,
        };

        try {
            // Use Redux mutation to apply discount
            const response = await fetch('https://studentstationary-backend.vercel.app/api/v1/flash-sale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast.success("Discount applied successfully!");
            } else {
                toast.error("Failed to apply discount.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error applying discount.");
        }
    };

    // handleRemoveDis
    const handleRemoveDis = async (id: string) => {
        try {
            await fetch(`https://studentstationary-backend.vercel.app/api/v1/flash-sale/remove/${id}`, {
                method: 'DELETE',
            });
            toast.success("Discount removed successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Error removing discount.");
        }
    };

    return (
        <div className="wrap overflow-x-auto">
            <div className="overflow-x-auto table-auto w-full">
                <table className="w-full min-w-[600px] border border-gray-300">
                    <thead>
                        <tr>
                            <th className="p-2 text-sm md:text-base border">Select</th>
                            <th className="p-2 text-sm md:text-base border">Title</th>
                            <th className="p-2 text-sm md:text-base border">Price</th>
                            <th className="p-2 text-sm md:text-base border">OfferPrice</th>
                            <th className="p-2 text-sm md:text-base border">Status</th>
                            <th className="p-2 text-sm md:text-base border">Quantity</th>
                            <th className="p-2 text-sm md:text-base border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products?.meta.totalCount > 0 ? (
                            products.products.map((listing) => (
                                <tr key={listing._id} className="text-xs md:text-sm border">
                                    {
                                        listing._id && (
                                            <td className="p-2 border">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => handleCheckboxChange(e, listing._id as string)}
                                                    checked={selectedProductIds.includes(listing._id)}
                                                />
                                            </td>
                                        )
                                    }

                                    <td className="p-2 border">{listing.name.slice(0, 30)}...</td>
                                    <td className="p-2 border">৳{listing.price}</td>
                                    <td className="p-2 border">৳{listing.offerPrice}</td>
                                    <td className="p-2 border">
                                        {listing.status}
                                    </td>
                                    <td className="p-2 border">
                                        {listing.quantity}
                                    </td>
                                    <td className="p-2 border">
                                        {
                                            listing.offerPrice ? (
                                                <button
                                                    className="bg-red-600 text-white p-2 rounded"
                                                    onClick={() => listing._id && handleRemoveDis(listing._id)} // Ensure _id is valid before calling
                                                >
                                                    Remove discount
                                                </button>
                                            ) : ''
                                        }
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-xs md:text-sm border">
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
                <Button onClick={handleApplyDiscount} className="bg-green-500">
                    Apply Discount
                </Button>
            </div>
        </div>
    );
};

export default AddFlashSale;
