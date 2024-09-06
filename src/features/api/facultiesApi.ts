import { createApi } from '@reduxjs/toolkit/query/react';
import { Faculty } from './types'
import { baseQuery } from './baseQuery';

export const facultiesApi = createApi({
  reducerPath: 'facultiesApi',
  baseQuery,
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
