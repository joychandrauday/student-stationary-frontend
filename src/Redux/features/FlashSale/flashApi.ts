

import { baseApi } from "@/Redux/api/baseApi";

// Define the flashSale type
interface flashSale {
    name: string;
    description: string;
    icon: string;
    _id?: string;
}
interface FlashSale {
    products: string[];       // Array of products in the flash sale
    discountPercentage: number;
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

const flashSaleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation for adding a flashSale
        addflashSale: builder.mutation<ApiResponse<flashSale>, FlashSale>({
            query: ({ products, discountPercentage }) => ({
                url: "/flash-sale",
                method: "POST",
                body: { products, discountPercentage }
            }),
        }),

        // Query for fetching categories with filters, sorting, and pagination
        getflashSale: builder.query<flashSale[], void>({
            query: () => ({
                url: "/flash-sale",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<flashSale[]>) => response.data,
        }),

        // Query to get a single flashSale by its ID
        getflashSaleById: builder.query<flashSale, string>({
            query: (flashSaleId) => ({
                url: `/flash-sale/${flashSaleId}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<flashSale>) => response.data,
        }),

        // Mutation to update a flashSale by its ID
        updateflashSale: builder.mutation<ApiResponse<flashSale>, { flashSaleId: string, updatedflashSale: Partial<flashSale> }>({
            query: ({ flashSaleId, updatedflashSale }) => ({
                url: `/flash-sale/${flashSaleId}`,
                method: "PATCH",
                body: updatedflashSale,
            }),
        }),

        // Mutation to delete a flashSale by its ID
        deleteflashSale: builder.mutation<ApiResponse<null>, string>({
            query: (flashSaleId) => ({
                url: `/flash-sale/${flashSaleId}`,
                method: "DELETE",
            }),
        }),
    }),
});

// Export hooks for usage in components
export const {
    useAddflashSaleMutation,
    useGetflashSaleQuery,
    useGetflashSaleByIdQuery,
    useUpdateflashSaleMutation,
    useDeleteflashSaleMutation,
} = flashSaleApi;
