import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const courseEvaluationsApi = createApi({
  reducerPath: 'courseEvaluationsApi',
  baseQuery,
  endpoints: (builder) => ({
    getAllCourseEvaluations: builder.query({
      query: () => '/course-evaluations',
    }),
    getCourseEvaluationById: builder.query({
      query: (id) => `/course-evaluations/${id}`,
    }),
    createCourseEvaluation: builder.mutation({
      query: (newEvaluation) => ({
        url: '/course-evaluations',
        method: 'POST',
        body: newEvaluation,
      }),
    }),
    updateCourseEvaluation: builder.mutation({
      query: ({ id, updatedEvaluation }) => ({
        url: `/course-evaluations/${id}`,
        method: 'PUT',
        body: updatedEvaluation,
      }),
    }),
    deleteCourseEvaluation: builder.mutation({
      query: (id) => ({
        url: `/course-evaluations/${id}`,
        method: 'DELETE',
      }),
    }),
    getCourseEvaluationsByInstructor: builder.query({
        query: (courseInstructorId) => `/course-evaluations/instructor/${courseInstructorId}`,
      }),
  }),
});

export const {
  useGetAllCourseEvaluationsQuery,
  useGetCourseEvaluationByIdQuery,
  useCreateCourseEvaluationMutation,
  useUpdateCourseEvaluationMutation,
  useDeleteCourseEvaluationMutation,
  useGetCourseEvaluationsByInstructorQuery
} = courseEvaluationsApi;
