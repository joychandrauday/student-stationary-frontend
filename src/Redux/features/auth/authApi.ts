import { baseApi } from "@/Redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => (
        {
            login: builder.mutation({
                query: (userInfo) => ({
                    url: '/users/login',
                    method: 'POST',
                    body: userInfo
                }),
            }),
            register: builder.mutation({
                query: (userInfo) => ({
                    url: '/users/register', // Endpoint for user registration
                    method: 'POST',
                    body: userInfo,
                }),
            }),
        }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;