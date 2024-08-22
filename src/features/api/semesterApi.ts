import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Semester } from '../api/types'; 

const apiUrl = import.meta.env.VITE_BASE_URL;

export const semestersApi = createApi({
  reducerPath: 'semestersApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  tagTypes: ['Semester'],
  endpoints: (builder) => ({
    getSemesters: builder.query<Semester[], void>({
      query: () => '/semesters',
    }),
    getSemesterById: builder.query<Semester, number>({
      query: (id) => `/semesters/${id}`,
    }),
    createSemester: builder.mutation<Semester, Partial<Semester>>({
      query: (newSemester) => ({
        url: '/semesters',
        method: 'POST',
        body: newSemester,
      }),
    }),
    updateSemester: builder.mutation<Semester, Partial<Semester> & Pick<Semester, 'id'>>({
      query: ({ id, ...updatedSemester }) => ({
        url: `/semesters/${id}`,
        method: 'PUT',
        body: updatedSemester,
      }),
    }),
    deleteSemester: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/semesters/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetSemestersQuery,
  useGetSemesterByIdQuery,
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
} = semestersApi;
