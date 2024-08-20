import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Course } from './types';

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => '/courses',
    }),
    getCourseById: builder.query<Course, number>({
      query: (id) => `/courses/${id}`,
    }),
    getCoursesByFaculty: builder.query<Course[], number>({
      query: (facultyId) => `/courses/faculty/${facultyId}`,
    }),
    getCoursesByMajor: builder.query<Course[], number>({
      query: (majorId) => `/courses/major/${majorId}`,
    }),
    addCourse: builder.mutation<void, Partial<Course>>({
      query: (course) => ({
        url: '/courses',
        method: 'POST',
        body: course,
      }),
    }),
    updateCourse: builder.mutation<void, Partial<Course>>({
      query: (course) => ({
        url: `/courses/${course.id}`,
        method: 'PUT',
        body: course,
      }),
    }),
    deleteCourse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByFacultyQuery,
  useGetCoursesByMajorQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;
