import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Center } from './types';

export const centersApi = createApi({
  reducerPath: 'centersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }), 
  endpoints: (builder) => ({
    getCenters: builder.query<Center[], void>({
      query: () => 'centers',
    }),
    getCenterById: builder.query<Center, number>({
      query: (id) => `centers/${id}`,
    }),
    createCenter: builder.mutation<Center, Partial<Center>>({
      query: (newCenter) => ({
        url: 'centers',
        method: 'POST',
        body: newCenter,
      }),
    }),
    updateCenter: builder.mutation<Center, Partial<Center> & { id: number }>({
      query: ({ id, ...updates }) => ({
        url: `centers/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteCenter: builder.mutation<void, number>({
      query: (id) => ({
        url: `centers/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCentersQuery,
  useGetCenterByIdQuery,
  useCreateCenterMutation,
  useUpdateCenterMutation,
  useDeleteCenterMutation,
} = centersApi;
