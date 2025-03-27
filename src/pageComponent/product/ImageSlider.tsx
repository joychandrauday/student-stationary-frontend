/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules";
import 'swiper/swiper-bundle.css';
const ImageSlider = ({ images }: { images: string[] }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    if (!images || images.length === 0) {
        return <p className="text-center text-gray-500">No images available</p>;
    }

    return (
        <div className="w-full">
            {/* Main Image Slider */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay, Thumbs]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                thumbs={{ swiper: thumbsSwiper }}
                className="rounded-lg shadow-lg w-full"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={img}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail Navigation */}
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                className="mt-4"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg cursor-pointer border hover:border-blue-500"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageSlider;
