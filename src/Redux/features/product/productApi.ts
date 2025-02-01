import { baseApi } from "@/Redux/api/baseApi";

// Define the product type
interface Product {
    name: string;
    brand: string;
    price: number;
    category: string;
    description: string;
    images: string[];
    featuredImages: string;
    quantity: number;
    inStock: boolean;
}

// Define the response type
interface ApiResponse<T> {
    message: string;
    success: boolean;
    data: T;
    meta: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        perPage: number;
    };
}

interface GetProductsParams {
    name?: string;
    brand?: string;
    category?: string;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    perPage?: number;
    sortBy?: string;  // sort parameter (e.g., 'price' or 'name')
    sortOrder?: 'asc' | 'desc';  // 'asc' or 'desc' for sorting order
}

const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation for adding a product
        addProduct: builder.mutation<ApiResponse<Product>, Product>({
            query: (product) => ({
                url: "/products",
                method: "POST",
                body: product,
            }),
        }),

        // Query for fetching products with filters, sorting, and pagination
        getProducts: builder.query<Product[], GetProductsParams>({
            query: (params) => ({
                url: "/products",
                method: "GET",
                params,  // Directly pass the params object
            }),
            transformResponse: (response: ApiResponse<Product[]>) => response.data,
        }),

        // Query to get a single product by its ID
        getProductById: builder.query<Product, string>({
            query: (productId) => ({
                url: `/products/${productId}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Product>) => response.data,
        }),

        // Mutation to update a product by its ID
        updateProduct: builder.mutation<ApiResponse<Product>, { productId: string, updatedProduct: Partial<Product> }>({
            query: ({ productId, updatedProduct }) => ({
                url: `/products/${productId}`,
                method: "PATCH",
                body: updatedProduct,
            }),
        }),

        // Mutation to delete a product by its ID
        deleteProduct: builder.mutation<ApiResponse<null>, string>({
            query: (productId) => ({
                url: `/products/${productId}`,
                method: "DELETE",
            }),
        }),
    }),
});

// Export hooks for usage in components
export const {
    useAddProductMutation,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productsApi;
