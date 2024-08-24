import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Exam } from './types';

export const examsApi = createApi({
  reducerPath: 'examsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getExams: builder.query<Exam[], void>({
      query: () => '/exams',
    }),
    getExamById: builder.query<Exam, number>({
      query: (id) => `/exams/${id}`,
    }),
    createExam: builder.mutation<Exam, Partial<Exam>>({
      query: (exam) => ({
        url: '/exams',
        method: 'POST',
        body: exam,
      }),
    }),
    updateExam: builder.mutation<Exam, Partial<Exam> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/exams/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),
    deleteExam: builder.mutation<void, number>({
      query: (id) => ({
        url: `/exams/${id}`,
        method: 'DELETE',
      }),
    }),
    restoreExam: builder.mutation<Exam, number>({
      query: (id) => ({
        url: `/exams/${id}/restore`,
        method: 'POST',
      }),
    }),
    forceDeleteExam: builder.mutation<void, number>({
      query: (id) => ({
        url: `/exams/${id}/force-delete`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useRestoreExamMutation,
  useForceDeleteExamMutation,
} = examsApi;
