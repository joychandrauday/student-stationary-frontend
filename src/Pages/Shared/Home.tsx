import BannerSlider from "@/pageComponent/HomeComponent/BannerSlider";
import BlogSection from "@/pageComponent/HomeComponent/BlogSection";
import DiscountGrid from "@/pageComponent/HomeComponent/DiscountGrid";
import FlashSale from "@/pageComponent/HomeComponent/FlashSale";
import ImageGrid from "@/pageComponent/HomeComponent/ImageGrid";
import OurService from "@/pageComponent/HomeComponent/OurService";
import ProductTabs from "@/pageComponent/HomeComponent/ProductTabs";
import StaticBgSection from "@/pageComponent/HomeComponent/StaticBgsection";
import { TestimonialSection } from "@/pageComponent/HomeComponent/Testimonials/Testimonials";

const Home = () => {
    return (

        <div className="min-h-screen">
            {/* Your content goes here */}
            <BannerSlider />
            <OurService />
            <DiscountGrid />
            <ProductTabs />
            <FlashSale />
            <ImageGrid />
            <StaticBgSection />
            <BlogSection />
            <TestimonialSection />
        </div >
    );
}

export default Home;
