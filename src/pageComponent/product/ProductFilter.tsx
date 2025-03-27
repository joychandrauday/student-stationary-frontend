/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star } from 'lucide-react';  // Import the Star icon from lucide-react
import { Menu, X } from 'lucide-react';  // Import the hamburger and close icons
import { useGetcategoryQuery } from '@/Redux/features/Category/categoryApi';
import { useGetBrandQuery } from '@/Redux/features/brand/brandApi';

const FilterSidebar = () => {
    const { data: categories } = useGetcategoryQuery()
    const { data: brands } = useGetBrandQuery()
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);  // State to control drawer visibility

    // Extract current query parameters from searchParams
    const searchTerm = searchParams.get('searchTerm') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const minRating = searchParams.get('minRating') || '';

    const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;

        if (value !== '' && value !== 'null') {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set(name, value);
                return newParams;
            });
        } else {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.delete(name);
                return newParams;
            });
        }
    };

    const handleSearchChange = (e: { target: { value: any; }; }) => {
        const { value } = e.target;
        if (value !== '' && value !== 'null') {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set('searchTerm', value);
                return newParams;
            });
        } else {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.delete('searchTerm');
                return newParams;
            });
        }
    };

    const handlePriceChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;

        if (value === '' || !isNaN(value)) {
            if (value !== '' && value !== 'null') {
                setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set(name, value);
                    return newParams;
                });
            } else {
                setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.delete(name);
                    return newParams;
                });
            }
        }
    };


    const resetFilters = () => {
        setSearchParams({});
    };
    return (
        <div className="relative">
            {/* Hamburger Icon for Mobile */}
            <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="lg:hidden  text-gray-700 absolute top-0 right-0 z-10"
            >
                {isDrawerOpen ?
                    <X size={24} />
                    :
                    <>
                        <div className="flex gap">
                            < Menu size={24} />
                            Filter Products
                        </div>
                    </>
                }
            </button>

            {/* Sidebar for larger screens */}
            <div
                className={`lg:w-full bg-white p-6 shadow-md lg:block fixed inset-0 z-20 transition-transform ${isDrawerOpen ? 'transform-none' : 'transform -translate-x-full'
                    } lg:transform-none lg:relative`}
            >
                {/* Close Button for Mobile Drawer */}
                <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="lg:hidden p-3 text-gray-700 absolute top-4 right-4 z-20"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Filters <span className="text-sm cursor-pointer underline" onClick={resetFilters}> Clear Filters X</span></h2>

                {/* Search Bar */}
                <div className="mb-6">
                    <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
                        Search
                    </label>
                    <input
                        type="text"
                        id="searchTerm"
                        name="searchTerm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mt-1 p-2 border bg-primary-foreground w-full"
                        placeholder="Search products"
                    />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={handleFilterChange}
                        className="mt-1 p-2 border bg-primary-foreground w-full"
                    >
                        <option value="">All</option>
                        {/* Add your categories here */}
                        {
                            categories?.map((category) => {
                                return (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        brand
                    </label>
                    <select
                        id="brand"
                        name="brand"
                        value={brand}
                        onChange={handleFilterChange}
                        className="mt-1 p-2 border bg-primary-foreground w-full"
                    >
                        <option value="">All</option>
                        {/* Add your categories here */}
                        {
                            brands?.map((brand) => {
                                return (
                                    <option key={brand._id} value={brand._id}>
                                        {brand.name}
                                    </option>
                                );
                            })
                        }
                    </select>
                </div>

                {/* Price Filters */}
                <div className="mb-6">
                    <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                        Min Price
                    </label>
                    <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        value={minPrice}
                        onChange={handlePriceChange}
                        className="mt-1 p-2 border bg-primary-foreground w-full"
                        placeholder="Min"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                        Max Price
                    </label>
                    <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        value={maxPrice}
                        onChange={handlePriceChange}
                        className="mt-1 p-2 border bg-primary-foreground w-full"
                        placeholder="Max"
                    />
                </div>

                {/* Rating Filters */}
                <div className="flex items-center">
                    {/* Render star icons for Min Rating */}
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        // Parse minRating as a number, default to 0 if it's undefined or NaN
                        const parsedMinRating = minRating ? Number(minRating) : 0;

                        return (
                            <button
                                key={ratingValue}
                                type="button"
                                className={`p-1 ${ratingValue <= parsedMinRating ? 'text-yellow-500' : 'text-gray-400'}`}
                                onClick={() => {
                                    setSearchParams((prev) => {
                                        const newParams = new URLSearchParams(prev);
                                        newParams.set('minRating', ratingValue.toString()); // Ensure minRating is stored as a string
                                        return newParams;
                                    });
                                }}
                            >
                                <Star size={20} />
                            </button>
                        );
                    })}
                </div>


                {/* Sorting Filters */}
                <div className="mb-6">
                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
                        Sort By
                    </label>
                    <select
                        id="sortBy"
                        name="sortBy"
                        value={sortBy}
                        onChange={handleFilterChange}
                        className="mt-1 p-2 border bg-primary-foreground w-full"
                    >
                        <option value="">None</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                        Sort Order
                    </label>
                    <select
                        id="sortOrder"
                        name="sortOrder"
                        value={sortOrder}
                        onChange={handleFilterChange}
                        className="mt-1 p-2 border bg-primary-foreground w-full"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
