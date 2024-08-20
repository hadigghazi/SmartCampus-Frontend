import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Faculty = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const facultiesApi = createApi({
  reducerPath: 'facultiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
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
