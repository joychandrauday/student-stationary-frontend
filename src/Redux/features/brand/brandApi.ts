import { baseApi } from "@/Redux/api/baseApi";

// Define the Brand type
interface Brand {
    name: string;
    description: string;
    icon: string;
    _id?: string;
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

const BrandApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation for adding a Brand
        addBrand: builder.mutation<ApiResponse<Brand>, Brand>({
            query: (Brand) => ({
                url: "/brand",
                method: "POST",
                body: Brand,
            }),
        }),

        // Query for fetching categories with filters, sorting, and pagination
        getBrand: builder.query<Brand[], void>({
            query: () => ({
                url: "/brand",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Brand[]>) => response.data,
        }),

        // Query to get a single Brand by its ID
        getBrandById: builder.query<Brand, string>({
            query: (brandId) => ({
                url: `/brand/${brandId}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Brand>) => response.data,
        }),

        // Mutation to update a Brand by its ID
        updateBrand: builder.mutation<ApiResponse<Brand>, { BrandId: string; updatedBrand: Partial<Brand> }>({
            query: ({ BrandId, updatedBrand }) => ({
                url: `/brand/${BrandId}`,  // Using BrandId (note the uppercase B)
                method: "PATCH",
                body: updatedBrand,
            }),
        }),


        // Mutation to delete a Brand by its ID
        deleteBrand: builder.mutation<ApiResponse<null>, string>({
            query: (BrandId) => ({
                url: `/Brand/${BrandId}`,
                method: "DELETE",
            }),
        }),
    }),
});

// Export hooks for usage in components
export const {
    useAddBrandMutation,
    useGetBrandQuery,
    useGetBrandByIdQuery,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
} = BrandApi;
