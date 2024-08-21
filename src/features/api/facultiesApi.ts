import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Faculty } from './types'
const apiUrl = import.meta.env.VITE_BASE_URL;

export const facultiesApi = createApi({
  reducerPath: 'facultiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    getFaculties: builder.query<Faculty[], void>({
      query: () => 'faculties',
    }),
    getFacultyById: builder.query<Faculty, number>({
      query: (id) => `faculties/${id}`,
    }),
    createFaculty: builder.mutation<Faculty, Partial<Faculty>>({
      query: (newFaculty) => ({
        url: 'faculties',
        method: 'POST',
        body: newFaculty,
      }),
    }),
    updateFaculty: builder.mutation<Faculty, { id: number; updatedFaculty: Partial<Faculty> }>({
      query: ({ id, updatedFaculty }) => ({
        url: `faculties/${id}`,
        method: 'PUT',
        body: updatedFaculty,
      }),
    }),
    deleteFaculty: builder.mutation<void, number>({
      query: (id) => ({
        url: `faculties/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetFacultiesQuery,
  useGetFacultyByIdQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} = facultiesApi;
