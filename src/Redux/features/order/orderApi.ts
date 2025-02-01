/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/Redux/api/baseApi";

const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrder: builder.query({
            query: (orderId: string) => ({
                url: `/orders/${orderId}`,
                method: "GET",
            }),
            transformResponse: (response: { message: string; success: boolean; data: any }) => response.data,
        }),
        getUserOrders: builder.query({
            query: (userId: string) => ({
                url: `/orders/${userId}`,
                method: "GET",
            }),
            transformResponse: (response: { message: string; success: boolean; data: any }) => response.data,
        }),
        allOrders: builder.query({
            query: () => ({
                url: `/orders`,
                method: "GET",
            }),
            transformResponse: (response: { message: string; success: boolean; data: any }) => response.data,
        }),
        createOrder: builder.mutation({
            query: (orderInfo: any) => ({
                url: `/orders`,
                method: "POST",
                body: orderInfo,
            }),
            transformResponse: (response: { message: string; success: boolean; data: any }) => response.data,
        }),
        updateOrder: builder.mutation({
            query: ({ orderId, updatedData }: { orderId: string; updatedData: Partial<any> }) => ({
                url: `/orders/${orderId}`,
                method: "PATCH",
                body: updatedData,
            }),
            transformResponse: (response: { message: string; success: boolean; data: any }) => response.data,
        }),
        deleteOrder: builder.mutation({
            query: (orderId: string) => ({
                url: `/orders/${orderId}`,
                method: "DELETE",
            }),
            transformResponse: (response: { message: string; success: boolean; data: any }) => response.data,
        }),
        verifyOrder: builder.query({
            query: (id) => ({
                url: "/orders/verify/payment",
                params: { sp_trxn_id: id }, // Pass an object for query parameters
                method: "GET",
            }),
        }),
        gettingSingleOrder: builder.query({
            query: (id) => ({
                url: `/orders/single/${id}`,
                params: { sp_trxn_id: id }, // Pass an object for query parameters
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetOrderQuery,
    useAllOrdersQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useGetUserOrdersQuery,
    useVerifyOrderQuery
} = ordersApi;
