import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Grade } from './types';

const apiUrl = import.meta.env.VITE_BASE_URL;

export const gradesApi = createApi({
  reducerPath: 'gradesApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    getGrades: builder.query<Grade[], void>({
      query: () => '/grades',
    }),
    getGradeById: builder.query<Grade, number>({
      query: (id) => `/grades/${id}`,
    }),
    createGrade: builder.mutation<Grade, Partial<Grade>>({
      query: (grade) => ({
        url: '/grades',
        method: 'POST',
        body: grade,
      }),
    }),
    updateGrade: builder.mutation<void, Grade>({
      query: (grade) => ({
        url: `/grades/${grade.id}`,
        method: 'PUT',
        body: grade,
      }),
    }),
    deleteGrade: builder.mutation<void, number>({
      query: (id) => ({
        url: `/grades/${id}`,
        method: 'DELETE',
      }),
    }),
    addGrade: builder.mutation<Grade, Partial<Grade>>({
      query: (grade) => ({
        url: '/grades/add',
        method: 'POST',
        body: grade,
      }),
    }),
    getGradesByInstructor: builder.query<any, number>({
      query: (courseInstructorId) => `grades/get/${courseInstructorId}`,
    }),
  }),
});

export const {
  useGetGradesQuery,
  useGetGradeByIdQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
  useAddGradeMutation,
  useGetGradesByInstructorQuery
} = gradesApi;
