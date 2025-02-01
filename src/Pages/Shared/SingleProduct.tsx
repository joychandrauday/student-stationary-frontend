/* eslint-disable @typescript-eslint/no-unused-vars */

import { Marquee } from '@/components/ui/marquee';
import { IProduct, IUser, ProductUpdate, useSingleProductQuery, IReview } from '@/Interfaces/types';
import { useCurrentUser } from '@/Redux/features/auth/authSlice';
import { useAppSelector } from '@/Redux/features/hook';
import { useCreateOrderMutation } from '@/Redux/features/order/orderApi';
import { useGetProductByIdQuery, useUpdateProductMutation } from '@/Redux/features/product/productApi';
import { useUpdateUserMutation } from '@/Redux/features/user/userApi';
import addToCart from '@/Utils/addToCard';
import useUser from '@/Utils/useUser';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ScrollRestoration, useParams } from 'react-router-dom';

const SingleProduct = () => {
    const { id } = useParams();
    const userId = id || '';
    const [quantity, setQuantity] = useState<number>(1);  // Ensuring quantity is typed as a number
    const [shippingAddress, setShippingAddress] = useState('');
    const [showShipping, setShowShipping] = useState(false);
    const handleBuyNowClick = () => {
        setShowShipping(true); // Show the shipping address field when clicking Buy Now
    };

    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email) as { user: IUser | null; isLoading: boolean; error: unknown };

    const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery<useSingleProductQuery>(userId);  // Properly typed product
    const [updateProduct] = useUpdateProductMutation();
    const [updateUser] = useUpdateUserMutation();
    const [createOrder] = useCreateOrderMutation();

    const handleAddToCart = (product: IProduct) => {
        addToCart(product, user, updateProduct, updateUser, refetch);
    };

    // Handle Buy Now functionality
    const handleBuyNow = async () => {
        if (product?.quantity < quantity || quantity <= 0) {
            toast.error('Invalid quantity or product is out of stock.');
            return;
        }

        try {
            if (!user) {
                toast.error('User not found!');
                return;
            }
            const orderInfo = {
                user: user._id,
                products: {
                    productId: product._id,
                    quantity: quantity,
                    price: product.price,
                    totalPrice: product.price * quantity,
                },
                amount: product.price * quantity,
                shippingAddress,
                paymentStatus: 'Pending',
                orderStatus: 'Pending',
                estimatedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
                orderDate: new Date(),
            };

            const res = await createOrder(orderInfo).unwrap();
            if (res.payment.checkout_url) {
                window.open(res.payment.checkout_url);
            } else {
                toast.error('Something went wrong!');
            }
        } catch (error) {
            toast.error('Payment initiation failed!');
        }

    };

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target; // Extract name and value from the target element
        setReview((prev: IReview) => ({ ...prev, [name]: value }));
    };

    const [review, setReview] = useState<IReview>({
        userId: { _id: '', name: '', avatar: '', role: '' }, // Set userId as an object with the appropriate fields
        rating: 0,
        description: '',
        createdAt: new Date(),
    });

    const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (review.rating && review.description && id && user?._id) {
            const newReview: IReview = {
                userId: {  // Make sure userId is an object with the required fields
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                },
                description: review.description,
                rating: review.rating,
                createdAt: new Date(),
            };

            updateProduct({
                productId: id,
                updatedProduct: { reviews: [...(product?.reviews || []), newReview] } as ProductUpdate,
            })
                .then((response) => {
                    if (response.data) {
                        setReview({ userId: { _id: '', name: '', avatar: '', role: '' }, rating: 0, description: '', createdAt: new Date() });
                        toast.success('Review submitted successfully!');
                        refetch()
                    }
                })
                .catch(() => {
                    toast.error('Error submitting your review!');
                });
        } else {
            toast.error('Please provide a rating and a comment!');
        }
    };



    if (isLoading) return <p>Loading product details...</p>;
    if (isError) return <p>Error fetching product details.</p>;

    const { name, description, brand, price, category, featuredImages, quantity: stock, inStock, images, reviews, createdAt, updatedAt } = product || {};

    return (
        <div className="min-h-screen">
            <div className="mx-auto bg-white shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <img src={featuredImages} alt={name} className="w-full h-80 object-cover rounded-lg" />

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                        <p className="text-gray-600 mt-2">{description}</p>
                        <p className="text-gray-700"><span className="font-semibold">Brand:</span> {brand}</p>
                        <p className="text-gray-700"><span className="font-semibold">Category:</span> {category}</p>
                        <p className="text-gray-700"><span className="font-semibold">Price:</span> ৳{price}</p>
                        <p className="text-gray-700"><span className="font-semibold">Stock:</span> {inStock ? 'In Stock' : 'Out of Stock'}</p>
                        <p className="text-gray-500 text-sm mt-4">Created at: {new Date(createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-500 text-sm">Updated at: {new Date(updatedAt).toLocaleDateString()}</p>

                        {/* Quantity Input */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                max={stock}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="mt-1 w-full p-2 border rounded bg-primary-foreground"
                            />
                        </div>

                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock || product.quantity === 0 || !user}
                            className={`mt-4 w-full py-3 text-white font-semibold rounded ${inStock ? 'bg-primary-foreground hover:bg-primary' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Add to Cart
                        </button>
                        {showShipping && (
                            <div className="mt-4">
                                <label htmlFor="shippingAddress" className="block text-gray-700 font-medium mb-2">
                                    Shipping Address:
                                </label>
                                <input
                                    type="text"
                                    name="shippingAddress"
                                    id="shippingAddress"
                                    className="w-full px-4 py-2 border border-gray-300 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter your shipping address here..."
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Buy Now Button */}
                        <button
                            onClick={showShipping ? handleBuyNow : handleBuyNowClick}
                            disabled={!product.inStock || product.quantity === 0 || !user}
                            className={`mt-4 w-full py-3 text-white font-semibold  ${product.inStock ? "bg-primary-foreground hover:bg-primary" : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {showShipping ? "Confirm Purchase" : "Buy Now"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2">
                        <Marquee pauseOnHover className="[--duration:20s]">
                            {images?.map((image, index) => (
                                <img key={index} src={image} alt={name} className="w-1/3 object-cover rounded-lg" />
                            ))}
                        </Marquee>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
                            {reviews?.length ? (
                                <div className="mt-4 space-y-6">
                                    {reviews.map((review, index: number) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded shadow-md border">
                                            <p className="font-semibold text-gray-800">{review.userId?.name}</p>

                                            <p className="text-gray-600 text-sm">{review.rating} ⭐</p>
                                            <p className="text-gray-600 mt-2">{review.description}</p>
                                        </div>
                                    ))}
                                </div>

                            ) : <p className="text-gray-500 mt-4">No reviews yet.</p>}
                        </div>

                        <form onSubmit={handleReviewSubmit} className="mt-8 space-y-4">
                            <input
                                type="number"
                                name="rating"
                                value={review.rating}
                                onChange={handleReviewChange}
                                min="1"
                                max="5"
                                className="w-full p-2 border rounded bg-primary-foreground"
                                required
                            />
                            <textarea
                                name="description"  // Ensure this matches the state key you're using (e.g., 'comment' or 'description')
                                value={review.description} // Update the correct field in your state
                                onChange={handleReviewChange}
                                rows={4}
                                className="w-full p-2 border rounded bg-primary-foreground"
                                required
                            />
                            <button type="submit" className="py-2 px-4 bg-primary-foreground text-white hover:bg-primary">
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ScrollRestoration />
        </div>
    );
};

export default SingleProduct;
