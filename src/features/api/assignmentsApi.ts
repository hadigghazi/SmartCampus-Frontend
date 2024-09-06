import { createApi } from '@reduxjs/toolkit/query/react';
import { Assignment } from './types';
import { baseQuery } from './baseQuery';

export const assignmentsApi = createApi({
  reducerPath: 'assignmentsApi',
  baseQuery,
  endpoints: (builder) => ({
    fetchAssignmentsByInstructor: builder.query<Assignment[], number>({
      query: (courseInstructorId) => `assignments/instructor/${courseInstructorId}`,
    }),
    addAssignment: builder.mutation<void, { courseInstructorId: number; data: FormData }>({
      query: ({ data }) => ({
        url: `assignments`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteAssignment: builder.mutation<void, number>({
      query: (assignmentId) => ({
        url: `assignments/${assignmentId}`,
        method: 'DELETE',
      }),
    }),
    getAssignmentDetails: builder.query<Assignment, number>({
      query: (id) => `assignments/${id}`,
    }),
  }),
});

export const { useFetchAssignmentsByInstructorQuery, useAddAssignmentMutation, useDeleteAssignmentMutation, useGetAssignmentDetailsQuery } = assignmentsApi;
