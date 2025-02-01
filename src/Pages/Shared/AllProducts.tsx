/* eslint-disable react-hooks/exhaustive-deps */
import { IProduct, IUser, useAllProductssQuery } from "@/Interfaces/types";
import { useCurrentUser } from "@/Redux/features/auth/authSlice";
import { useAppSelector } from "@/Redux/features/hook";
import { useGetProductsQuery, useUpdateProductMutation } from "@/Redux/features/product/productApi";
import { useUpdateUserMutation } from "@/Redux/features/user/userApi";
import addToCart from "@/Utils/addToCard";
import useUser from "@/Utils/useUser";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AllProducts = () => {
    const userToken = useAppSelector(useCurrentUser);
    const { user } = useUser(userToken?.email) as { user: IUser | null; isLoading: boolean; error: unknown };
    const [updateUser] = useUpdateUserMutation();
    const [updateProduct] = useUpdateProductMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // State for filters
    const [filters, setFilters] = useState({
        searchTerm: "",
        categoryFilter: "",
        inStockFilter: "all",
        sortBy: "",
        sortOrder: "asc",
        page: 1,
        minPrice: 0,
        maxPrice: 1000,
    });
    useEffect(() => {
        if (queryParams) {
            const searchTermParam = queryParams.get("search");
            if (searchTermParam) {
                setFilters((prev) => ({
                    ...prev,
                    searchTerm: searchTermParam,
                }));
            }
        }
    }, []);

    // State for quantity per product
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const { searchTerm, categoryFilter, inStockFilter, sortBy, sortOrder, page, minPrice, maxPrice } = filters;

    // Fetch products with filtering and search logic
    const inStockParam = inStockFilter === "all" ? undefined : inStockFilter === "inStock" ? true : false;

    // Fetch products with filtering and search logic
    const { data: products = [], isLoading, isError, meta, refetch } = useGetProductsQuery<useAllProductssQuery>({
        name: searchTerm || undefined,  // Filter by search term
        category: categoryFilter || undefined,
        inStock: inStockParam,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
        page: filters.page,
        minPrice,
        maxPrice,
    });


    const totalPages = meta?.totalPages || 1;

    // Handle changes in filters like category, price, etc.
    const handleFilterChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: name === "minPrice" || name === "maxPrice" ? Number(value) : value,
        }));
    };

    // Handle changes in search term
    const handleSearchChange = (e: { target: { value: string; }; }) => {
        setFilters((prev) => ({
            ...prev,
            searchTerm: e.target.value, // Update search term
            page: 1,  // Reset to first page on search change
        }));
    };

    // Handle page change for pagination
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setFilters((prev) => ({
                ...prev,
                page: newPage,
            }));
        }
    };

    // Handle quantity change for products in the cart
    const handleQuantityChange = (productId: string, value: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Number(value),
        }));
    };
    const handleAddToCart = (product: IProduct) => {
        addToCart(product, user, updateProduct, updateUser, refetch);
    };
    const categories: string[] = ["Writings", "Office", "Art", "Educational", "Technology", "Others"];

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching products.</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">All Products</h1>

                {/* Filter Section */}
                <div className="mb-6 p-4 bg-white shadow-md  flex flex-wrap gap-4">
                    {/* Search Bar */}
                    <div>
                        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            name="searchTerm"
                            value={searchTerm}
                            onChange={handleSearchChange}  // Bind search input to state
                            className="mt-1 p-2 border bg-primary-foreground w-full"
                            placeholder="Search products"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="categoryFilter"
                            name="categoryFilter"
                            value={categoryFilter}
                            onChange={handleFilterChange}
                            className="mt-1 p-2 border bg-primary-foreground w-full"
                        >
                            <option value="">All</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Filters */}
                    <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                            Min Price
                        </label>
                        <input
                            type="number"
                            id="minPrice"
                            name="minPrice"
                            value={minPrice}
                            onChange={handleFilterChange}
                            className="mt-1 p-2 border bg-primary-foreground w-full"
                            placeholder="Min"
                        />
                    </div>

                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                            Max Price
                        </label>
                        <input
                            type="number"
                            id="maxPrice"
                            name="maxPrice"
                            value={maxPrice}
                            onChange={handleFilterChange}
                            className="mt-1 p-2 border bg-primary-foreground w-full"
                            placeholder="Max"
                        />
                    </div>

                    {/* Sorting Filters */}
                    <div>
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

                    <div>
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

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white p-4 rounded-none shadow-md relative">
                            <img src={product.featuredImages} alt={product.name} className="w-full h-40 object-cover mb-4" />

                            <div className="absolute top-2 right-2 bg-primary rounded-full px-2 text-sm">
                                Only {product.quantity} piece left
                            </div>

                            <h2 className="text-lg font-medium text-gray-800">{product.name}</h2>

                            {/* Show Discounted Price if Available */}
                            <p className="text-gray-600">
                                {product.discount ? (
                                    <>
                                        <span className="line-through text-red-500">৳{product.price}</span>
                                        <span className="text-green-600 font-bold ml-2">৳{(product.price - (product.price * product.discount / 100)).toFixed(2)}</span>
                                    </>
                                ) : (
                                    <span>৳{product.price}</span>
                                )}
                            </p>

                            <p className="text-yellow-500 font-medium">Rating: {product.rating} ⭐</p>
                            <p className="text-gray-500 text-sm">Stock: {product.inStock ? "In Stock" : "Out of Stock"}</p>

                            <input
                                type="number"
                                min="1"
                                max={product.quantity}
                                value={quantities[product._id] ?? 1}
                                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                className="mt-1 w-full p-2 border rounded bg-primary-foreground"
                            />

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className={!product.inStock || product.quantity === 0 || !user ? "cursor-not-allowed w-full bg-gray-500 text-white py-2 hover:bg-primary" : "w-full bg-primary-foreground text-white py-2 hover:bg-primary"}
                                    disabled={!product.inStock || product.quantity === 0 || !user}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="w-full bg-gray-300 text-gray-700 py-2 hover:bg-gray-400"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>

                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center items-center">
                    <nav>
                        <ul className="inline-flex space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 border ${page === index + 1 ? "bg-blue-500 text-white" : ""}`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
