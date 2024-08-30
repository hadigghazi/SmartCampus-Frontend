import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Assignment } from './types';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const assignmentsApi = createApi({
  reducerPath: 'assignmentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
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
  }),
});

export const { useFetchAssignmentsByInstructorQuery, useAddAssignmentMutation, useDeleteAssignmentMutation } = assignmentsApi;
