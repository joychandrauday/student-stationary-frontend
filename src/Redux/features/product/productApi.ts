import { IReview } from "@/Interfaces/types";
import { baseApi } from "@/Redux/api/baseApi";



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
    searchTerm?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    status?: string;
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface Brand {
    _id?: string;
    name: string;
    description: string;
    icon: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface Category {
    _id?: string | undefined;
    name?: string;
    description: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Product {
    _id?: string;
    name: string;
    description: string;
    brand: Brand | string | {
        _id?: string;
        name: string;
        description: string;
        icon: string;
        createdAt?: string;
        updatedAt?: string;
        __v?: number;
    };
    price: number;
    category: Category | string;
    status: string;
    images: string[];
    featuredImages: string;
    quantity: number;
    inStock: boolean;
    createdAt?: string;
    updatedAt?: string;
    reviews?: IReview[];
    __v?: number;
    discount: number;
    rating: number;
    offerPrice: number;
}

interface Meta {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
}

interface GeTApiResponse<T> {
    success: boolean;
    message: string;
    data: {
        products: T[];
        meta: Meta;
    };
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

        getProducts: builder.query<{ products: Product[]; meta: Meta }, GetProductsParams>({
            query: (params) => ({
                url: "/products",
                method: "GET",
                params,
            }),
            transformResponse: (response: GeTApiResponse<Product[]>) => ({
                products: response.data.products.flat(), // Flatten the products if necessary
                meta: response.data.meta, // Include the meta information
            }),
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
