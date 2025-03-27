import { baseApi } from "@/Redux/api/baseApi";

// Define the category type
interface Category {
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

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation for adding a category
        addcategory: builder.mutation<ApiResponse<Category>, Category>({
            query: (category) => ({
                url: "/category",
                method: "POST",
                body: category,
            }),
        }),

        // Query for fetching categories with filters, sorting, and pagination
        getcategory: builder.query<Category[], void>({
            query: () => ({
                url: "/category",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Category[]>) => response.data,
        }),

        // Query to get a single category by its ID
        getcategoryById: builder.query<Category, string>({
            query: (categoryId) => ({
                url: `/category/${categoryId}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Category>) => response.data,
        }),

        // Mutation to update a category by its ID
        updatecategory: builder.mutation<ApiResponse<Category>, { categoryId: string | undefined, updatedCategory: Partial<Category> }>({
            query: ({ categoryId, updatedCategory }) => ({
                url: `/category/${categoryId}`,
                method: "PATCH",
                body: updatedCategory,
            }),
        }),

        // Mutation to delete a category by its ID
        deletecategory: builder.mutation<ApiResponse<null>, string>({
            query: (categoryId) => ({
                url: `/category/${categoryId}`,
                method: "DELETE",
            }),
        }),
    }),
});

// Export hooks for usage in components
export const {
    useAddcategoryMutation,
    useGetcategoryQuery,
    useGetcategoryByIdQuery,
    useUpdatecategoryMutation,
    useDeletecategoryMutation,
} = categoryApi;
