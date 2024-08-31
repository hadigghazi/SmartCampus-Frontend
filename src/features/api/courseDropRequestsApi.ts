import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CourseDropRequest } from './types';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const courseDropRequestsApi = createApi({
  reducerPath: 'courseDropRequestsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    getCourseDropRequests: builder.query<CourseDropRequest[], void>({
      query: () => '/course_drop_requests',
    }),
    getCourseDropRequestById: builder.query<CourseDropRequest, number>({
      query: (id) => `/course_drop_requests/${id}`,
    }),
    requestDrop: builder.mutation<CourseDropRequest, Omit<CourseDropRequest, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>({
      query: (newRequest) => ({
        url: '/course_drop_requests/request',
        method: 'POST',
        body: newRequest,
      }),
    }),
    updateStatus: builder.mutation<CourseDropRequest, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/course_drop_requests/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
    }),
    getDropRequestsByInstructor: builder.query<CourseDropRequest[], number>({
      query: (courseInstructorId) => `/course_drop_requests/instructor/${courseInstructorId}`,
    }),
    deleteDropRequest: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/course_drop_requests/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCourseDropRequestsQuery,
  useGetCourseDropRequestByIdQuery,
  useRequestDropMutation,
  useUpdateStatusMutation,
  useGetDropRequestsByInstructorQuery,
  useDeleteDropRequestMutation,
} = courseDropRequestsApi;
