import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Course, CourseOption } from './types';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
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
    getCourseOptions: builder.query<CourseOption[], number>({
      query: (id) => `/courses/${id}/options`,
    }),
    createCourseOption: builder.mutation<CourseOption, Partial<CourseOption>>({
      query: (newOption) => ({
        url: '/course-instructors', 
        method: 'POST',
        body: newOption,
      }),
    }),
    updateCourseOption: builder.mutation<void, Partial<CourseOption>>({
      query: (option) => ({
        url: `/course-instructors/${option.id}`,
        method: 'PUT',
        body: option,
      }),
    }),
    deleteCourseOption: builder.mutation<void, number>({
      query: (id) => ({
        url: `/course-instructors/${id}`,
        method: 'DELETE',
      }),
    }),
    getCourseInstructors: builder.query<CourseOption[], void>({
      query: () => '/course-instructors',
    }),
    getCoursesAssignedToInstructor: builder.query<Course[], number>({
      query: (instructorId) => `/instructors/${instructorId}/courses`,
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
  useGetCourseOptionsQuery,
  useCreateCourseOptionMutation,
  useDeleteCourseOptionMutation,
  useUpdateCourseOptionMutation,
  useGetCourseInstructorsQuery,
  useGetCoursesAssignedToInstructorQuery
} = coursesApi;
