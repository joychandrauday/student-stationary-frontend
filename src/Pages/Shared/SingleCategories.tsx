import { IProduct } from '@/Interfaces/types';
import ProductCard from '@/pageComponent/product/ProductCard';
import { useGetProductsQuery } from '@/Redux/features/product/productApi';
import { useParams } from 'react-router-dom';

const SingleCategories = () => {
    const { category } = useParams<{ category: string }>();

    const queryParams = {
        category,
    };

    const { data, isLoading, isError } = useGetProductsQuery(queryParams);

    const products = data?.products || [];
    console.log(products);

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching products. Please try again later.</div>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center my-4">Products in {category}</h2>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                        No products found in this category
                    </div>
                ) : (
                    products.map((product: IProduct) => (
                        <ProductCard product={product} />
                    ))
                )}
            </div>
        </div>
    );
};

export default SingleCategories;
