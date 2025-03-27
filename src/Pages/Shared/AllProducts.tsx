
import FilterSidebar from "@/pageComponent/product/ProductFilter";
import ProductPagination from "@/pageComponent/product/ProductPagination";
import { useGetProductsQuery } from "@/Redux/features/product/productApi";
import { ScrollRestoration, useSearchParams } from "react-router-dom";
import loader from '../../assets/loader2.gif'; // Assuming you have the loader image
import ProductCard from "@/pageComponent/product/ProductCard";





const AllProducts = () => {
    const [searchParams] = useSearchParams();

    const searchTerm = searchParams.get('searchTerm') || '';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
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
        ...(brand && brand !== 'null' && { brand }),
        ...(parsedMinPrice && !isNaN(parsedMinPrice) && { minPrice: parsedMinPrice }),
        ...(parsedMaxPrice && !isNaN(parsedMaxPrice) && { maxPrice: parsedMaxPrice }),
        ...(parsedMinRating && !isNaN(parsedMinRating) && { minRating: parsedMinRating }),
        ...(sortBy && { sortBy }),
        sortOrder,
        status,
        page,
        perPage: 9,
    };

    const { data, isLoading, isError } = useGetProductsQuery(queryParams);
    const { products, meta } = data || {};
    const totalPages = meta?.totalPages;

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <div className="md:max-w-7xl mx-auto md:flex gap-8">
                <FilterSidebar />

                <div className="md:w-3/4 w-full">
                    <h1 className="text-3xl font-semibold mb-6 text-gray-800">All Products </h1>

                    {isLoading && (
                        <div className="flex justify-center items-center">
                            <img src={loader} alt="Loading..." className="w-16 h-16" />
                        </div>
                    )}

                    {isError && (
                        <p className="text-center text-red-600">Something went wrong while fetching the products.</p>
                    )}

                    {meta?.totalCount === 0 && (
                        <p className="text-center text-gray-600">No products found.</p>
                    )}

                    {!isLoading && !isError && products && (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 items-center justify-center lg:grid-cols-3 gap-6">
                            {products.map((product, index: number) => (
                                <ProductCard
                                    key={index}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}

                    <ProductPagination totalPage={Number(totalPages)} />
                </div>
            </div>
            <ScrollRestoration />
        </div>
    );
};

export default AllProducts;
