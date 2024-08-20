import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Campus } from './types';

export const campusesApi = createApi({
  reducerPath: 'campusesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }), 
  endpoints: (builder) => ({
    getCampuses: builder.query<Campus[], void>({
      query: () => '/campuses',
    }),
    getCampusById: builder.query<Campus, number>({
      query: (id) => `/campuses/${id}`,
    }),
    createCampus: builder.mutation<Campus, Partial<Campus>>({
      query: (newCampus) => ({
        url: '/campuses',
        method: 'POST',
        body: newCampus,
      }),
    }),
    updateCampus: builder.mutation<Campus, Partial<Campus> & { id: number }>({
      query: ({ id, ...updates }) => ({
        url: `/campuses/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteCampus: builder.mutation<void, number>({
      query: (id) => ({
        url: `/campuses/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCampusesQuery,
  useGetCampusByIdQuery,
  useCreateCampusMutation,
  useUpdateCampusMutation,
  useDeleteCampusMutation,
} = campusesApi;
