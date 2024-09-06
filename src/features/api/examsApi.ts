import { createApi } from '@reduxjs/toolkit/query/react';
import { Exam } from './types';
import { baseQuery } from './baseQuery';

export const examsApi = createApi({
  reducerPath: 'examsApi',
  baseQuery,
  endpoints: (builder) => ({
    getExams: builder.query<Exam[], void>({
      query: () => '/exams',
    }),
    getExamsDetails: builder.query<Exam[], void>({
        query: () => 'get_exam_details',
      }),
    getExamById: builder.query<Exam, number>({
      query: (id) => `/exams/${id}`,
    }),
    getExamInstructorDetails: builder.query<Exam, number>({
        query: (id) => `/exams/instructor-details/${id}`,
      }),
      getExamDetails: builder.query<Exam, number>({
        query: (id) => `/exams/details/${id}`,
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
  }),
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useGetExamDetailsQuery,
  useGetExamsDetailsQuery,
  useLazyGetExamDetailsQuery,
  useGetExamInstructorDetailsQuery
} = examsApi;
