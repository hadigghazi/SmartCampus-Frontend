import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FacultiesCampuses } from './types';

const apiUrl = import.meta.env.VITE_BASE_URL;

export const facultiesCampusesApi = createApi({
  reducerPath: 'facultiesCampusesApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }), 
  endpoints: (builder) => ({
    getFacultiesCampuses: builder.query<FacultiesCampuses[], void>({
      query: () => '/faculties-campuses',
    }),
    getFacultiesCampusById: builder.query<FacultiesCampuses, number>({
      query: (id) => `/faculties-campuses/${id}`,
    }),
    createFacultiesCampus: builder.mutation<FacultiesCampuses, Partial<FacultiesCampuses>>({
      query: (facultiesCampus) => ({
        url: '/faculties-campuses',
        method: 'POST',
        body: facultiesCampus,
      }),
    }),
    updateFacultiesCampus: builder.mutation<void, FacultiesCampuses>({
        query: (facultiesCampus) => ({
          url: `/faculties-campuses/${facultiesCampus.id}`,
          method: 'PUT',
          body: facultiesCampus,
        }),
      }),
    deleteFacultiesCampus: builder.mutation<void, number>({
      query: (id) => ({
        url: `/faculties-campuses/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetFacultiesCampusesQuery,
  useGetFacultiesCampusByIdQuery,
  useCreateFacultiesCampusMutation,
  useUpdateFacultiesCampusMutation,
  useDeleteFacultiesCampusMutation,
} = facultiesCampusesApi;
