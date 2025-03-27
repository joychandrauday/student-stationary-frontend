/* eslint-disable @typescript-eslint/no-unused-vars */
import { IProduct, ProductUpdate, useSingleProductQuery, IReview } from '@/Interfaces/types';
import ImageSlider from '@/pageComponent/product/ImageSlider';
import { useAppDispatch } from '@/Redux/features/hook';
import { useCreateOrderMutation } from '@/Redux/features/order/orderApi';
import { useGetProductByIdQuery, useUpdateProductMutation } from '@/Redux/features/product/productApi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ScrollRestoration, useParams } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Import icons for stars
import LoadingPage from '@/pageComponent/Shared/LoadingPage';
import { addProduct } from '@/Redux/features/cart/cartSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/features/store';
import { Trash } from 'lucide-react';
import Swal from 'sweetalert2';

const SingleProduct = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const { id } = useParams();
    const userId = id || '';
    const [quantity, setQuantity] = useState<number>(1);  // Ensuring quantity is typed as a number
    const [shippingAddress, setShippingAddress] = useState('');
    const [showShipping, setShowShipping] = useState(false);
    const handleBuyNowClick = () => {
        setShowShipping(true); // Show the shipping address field when clicking Buy Now
    };
    const dispatch = useAppDispatch()
    const addToCart = (product: IProduct) => {
        dispatch(addProduct(product));
        toast.success(`${product.name} added to Cart!`, {
            icon: "✅",
            duration: 2000,
        });
    };
    const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery<useSingleProductQuery>(userId);  // Properly typed product
    const [updateProduct] = useUpdateProductMutation();
    const [createOrder] = useCreateOrderMutation();

    // Handle Buy Now functionality
    const handleBuyNow = async () => {
        if (!product.quantity) {
            return;
        }
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
        userId: user.id,
        rating: 0,
        description: '',
        createdAt: new Date(),
    });

    const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (review.rating && review.description && id && user) {
            const newReview: IReview = {
                userId: user.id,
                description: review.description,
                rating: review.rating,
                createdAt: new Date(),
            };
            console.log(newReview);
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
    const handleDeleteReview = (reviewToDelete: IReview) => {
        // Check if product.reviews is undefined or empty
        if (!product?.reviews || product.reviews.length === 0) {
            toast.error("No reviews available to delete.");
            return;
        }

        // Use SweetAlert2 to confirm review deletion
        Swal.fire({
            title: "Are you sure?",
            text: "This review will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Ensure the user is allowed to delete their own review (Optional)
                if (reviewToDelete.userId._id !== user.id) {
                    toast.error("You can only delete your own reviews.");
                    return;
                }
                if (!product?.reviews || product.reviews.length === 0) {
                    toast.error("No reviews available to delete.");
                    return;
                }
                if (!id) {
                    toast.error("Product ID not found");
                    return;
                }
                const updatedReviews = product?.reviews.filter(
                    (review) => review._id !== reviewToDelete._id
                );

                if (updatedReviews) {
                    updateProduct({
                        productId: id,
                        updatedProduct: { reviews: updatedReviews } as ProductUpdate,
                    })
                        .then((response) => {
                            if (response.data) {
                                toast.success("Review deleted successfully!");
                                refetch(); // Refetch to get the updated product details
                            }
                        })
                        .catch((error) => {
                            toast.error("Error deleting the review.");
                            console.error("Error deleting the review: ", error);
                        });
                }
            }
        });
    };

    const handleStarClick = (rating: number) => {
        setReview((prev: IReview) => ({ ...prev, rating }));
    };

    if (isLoading) return <LoadingPage />;
    if (isError) return <p>Error fetching product details.</p>;

    const { name, description, brand, price, category, quantity: stock, inStock, images, reviews } = product || {};
    const brandName = typeof brand === 'string' ? brand : brand?.name || 'Unknown Brand';
    const catName = typeof category === 'string' ? category : category?.name || 'Unknown Brand';
    const getStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-primary-foreground" />);
            } else if (i - 0.5 === rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-primary-foreground" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-300" />);
            }
        }
        return stars;
    };
    return (
        <div className="min-h-screen">
            <div className="mx-auto bg-white shadow-lg p-6">


                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2">
                        {images ?

                            <ImageSlider images={images} />
                            :
                            <img className="object-cover w-full h-64 rounded-lg" src="https://via.placeholder.com/500x300" alt="Product" />
                        }
                    </div>

                    <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        {/* Product Title & Description */}
                        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                        <p className="text-gray-600 mt-2">{description}</p>

                        {/* Product Info */}
                        <div className="mt-4 space-y-2">
                            <p className="text-gray-700"><span className="font-semibold">Brand:</span> {brandName}</p>

                            <p className="text-gray-700"><span className="font-semibold">Category:</span> {catName}</p>
                            <p className="text-xl font-bold text-primary">৳{price}</p>
                            <p className={`font-semibold ${inStock ? "text-green-600" : "text-red-500"}`}>
                                {inStock ? "In Stock" : "Out of Stock"}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <div className="flex items-center mt-2 border rounded-lg w-max">
                                <button
                                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                    className="px-3 py-2 bg-gray-500 hover:bg-gray-300 rounded-l-md"
                                >-</button>
                                <input
                                    type="number"
                                    min="1"
                                    max={stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-14 text-black text-center border-x outline-none"
                                />
                                <button
                                    onClick={() => setQuantity(Number(quantity) < Number(stock) ? Number(stock) + 1 : Number(stock))}
                                    className="px-3 py-2 bg-gray-500 hover:bg-gray-300 rounded-r-md"
                                >+</button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={!inStock || !user}
                                className={`w-full py-3 font-semibold  rounded-lg transition ${inStock ? "bg-transparent border-primary-foreground border-2 text-primary hover:bg-primary-foreground" : "bg-gray-400 cursor-not-allowed"
                                    }`}
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Enter your shipping address..."
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                    />
                                </div>
                            )}

                            <button
                                onClick={showShipping ? handleBuyNow : handleBuyNowClick}
                                disabled={!inStock || !user}
                                className={`w-full py-3 font-semibold text-white rounded-lg transition ${inStock ? "bg-primary-foreground hover:bg-primary" : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {showShipping ? "Confirm Purchase" : "Buy Now"}
                            </button>
                        </div>
                    </div>

                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
                    <div className="">
                        {reviews?.length ? (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.map((review, index: number) => {
                                    const userInitial = review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : "?";

                                    return (
                                        <div key={index} className="p-5 relative bg-white rounded-lg shadow-md border border-gray-200 flex gap-4 items-start">
                                            {/* Avatar Section */}
                                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
                                                {review.userId?.avatar ? (
                                                    <img
                                                        src={review.userId.avatar}
                                                        alt={review.userId.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{userInitial}</span>
                                                )}
                                            </div>
                                            <div className="flex absolute top-2 right-2 items-center mt-1">{getStars(review.rating)}</div>
                                            {
                                                review.userId._id === user.id &&
                                                <button
                                                    className="flex absolute bottom-2 text-red-500 right-2 items-center mt-1"
                                                    onClick={() => handleDeleteReview(review)}
                                                >
                                                    <Trash />
                                                </button>
                                            }
                                            {/* Review Content */}
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">{review.userId?.name}</p>
                                                <p className="text-gray-600 ">{review.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>


                        ) : <p className="text-gray-500 mt-4">No reviews yet.</p>}
                    </div>
                </div>
                {/* Review Form */}
                <form onSubmit={handleReviewSubmit} className="mt-8 space-y-6">
                    <div className="flex gap-2 items-center">
                        <p className="text-sm text-gray-700">Rate this product:</p>
                        <div className="flex gap-1">
                            {getStars(review.rating).map((star, index) => (
                                <span
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() => handleStarClick(index + 1)}
                                >
                                    {star}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            name="description"
                            value={review.description}
                            onChange={handleReviewChange}
                            rows={4}
                            placeholder="Write your review..."
                            className="w-full p-4 border text-gray-700 border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        />

                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-200"
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
            <ScrollRestoration />
        </div>
    );
};

export default SingleProduct;
