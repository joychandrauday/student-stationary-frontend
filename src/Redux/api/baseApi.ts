import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        // baseUrl: 'http://localhost:3000/api/v1',
        baseUrl: 'https://studentstationary-backend.vercel.app/api/v1',
        credentials: 'include'
    }),
    endpoints: () => ({})
})