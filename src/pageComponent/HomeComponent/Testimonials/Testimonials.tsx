/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { FaStar } from 'react-icons/fa';
import { Autoplay, Pagination } from 'swiper/modules'; // Ensure to import the required modules
import LoadingPage from '@/pageComponent/Shared/LoadingPage';

export function TestimonialSection() {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    'https://studentstationary-backend.vercel.app/api/v1/products/reviews/all'
                );
                const data = await response.json();
                if (data.success) {
                    setReviews(data.data.slice(0, 5)); // Ensure the data structure matches
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    // Function to generate star ratings
    const generateStars = (rating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
            );
        }
        return stars;
    };

    return (
        <div className="relative flex w-full flex-col items-center justify-center py-20 px-4 bg-primary-foreground text-white">
            <h2 className="text-4xl font-bold mb-12 text-center">What Our Customers Say</h2>

            {reviews.length > 0 ? (
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false, // Ensures autoplay doesn't stop when interacting with the slider
                    }}
                    pagination={{
                        clickable: true,
                        type: 'bullets', // Ensures that pagination dots are shown
                    }}
                    navigation={false} // Disabled arrows as we're using dots
                    modules={[Autoplay, Pagination]} // Ensure modules are included
                    className="w-full max-w-4xl"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review._id}>
                            <div className="flex flex-col items-center p-8 rounded-lg shadow-xl transition-transform transform hover:scale-95 border">
                                {
                                    review.userId.avatar ? (
                                        <img
                                            src={review.userId.avatar || '/default-avatar.png'}
                                            alt={review.userId.name}
                                            className="w-24 h-24 rounded-full border-4 border-indigo-600 mb-4 transition-all transform hover:scale-110"
                                        />
                                    ) : (
                                        <div className="h-24 w-24 font-bold text-white text-3xl shadow text-primary-foreground rounded-full flex items-center justify-center mb-4 transition-all transform hover:scale-110">
                                            {review.userId.name[0]}
                                        </div>
                                    )
                                }
                                <p className="text-xl font-semibold mb-2 text-gray-800">{review.description}</p>

                                {/* Rating with stars */}
                                <div className="flex mb-2">
                                    {generateStars(review.rating)}
                                </div>

                                <p className="text-lg font-medium mb-2 text-gray-700">{review.userId.name}</p>
                                <span className="text-sm text-gray-500">
                                    Posted on: {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <LoadingPage />
            )}
        </div>
    );
}
