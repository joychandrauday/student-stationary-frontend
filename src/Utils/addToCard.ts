/* eslint-disable @typescript-eslint/no-explicit-any */

import { IProduct, IUser } from "@/Interfaces/types";  // Assuming these interfaces are already defined
import toast from "react-hot-toast";

// Reusable function to handle adding product to cart
const addToCart = async (
    product: IProduct,
    user: IUser | null,
    updateProduct: (args: { productId: string, updatedProduct: Partial<IProduct> }) => Promise<any>,
    updateUser: (args: { userId: string, updatedData: Partial<IUser> }) => Promise<any>,
    refetch: () => void
): Promise<void> => {
    try {
        if (product.quantity === 0) {
            await updateProduct({
                productId: product._id,
                updatedProduct: { inStock: false },
            });
            toast.error('The product is stocked out!!')
            return;
        }
        const quantity = 1; // Quantity can be dynamically adjusted
        const totalPrice = quantity * product.price;

        // Update product stock
        const productResponse = await updateProduct({
            productId: product._id,
            updatedProduct: { quantity: product.quantity - quantity },
        });

        if (!productResponse?.data) {
            throw new Error("Failed to update product stock.");
        }

        // Update user cart
        if (user) {
            const userResponse = await updateUser({
                userId: user._id,
                updatedData: {
                    cart: [
                        ...user.cart,
                        { productId: product._id, quantity, price: product.price, totalPrice },
                    ],
                },
            });

            if (userResponse?.data) {
                toast.success("Product added to cart successfully!");
                refetch(); // Refetch to update any necessary data
            } else {
                throw new Error("Failed to update user cart.");
            }
        } else {
            throw new Error("User is not logged in.");
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

export default addToCart;
