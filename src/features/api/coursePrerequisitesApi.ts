import { createApi } from '@reduxjs/toolkit/query/react';
import { CoursePrerequisite } from './types';
import { baseQuery } from './baseQuery';

export const coursePrerequisitesApi = createApi({
  reducerPath: 'coursePrerequisitesApi',
  baseQuery: baseQuery, 
  endpoints: (builder) => ({
    getCoursePrerequisites: builder.query<CoursePrerequisite[], number>({
      query: (courseId) => `/courses/${courseId}/prerequisites`,
    }),
    addCoursePrerequisite: builder.mutation<void, CoursePrerequisite>({
      query: (prerequisite) => ({
        url: 'course-prerequisites',
        method: 'POST',
        body: prerequisite,
      }),
    }),
    deleteCoursePrerequisite: builder.mutation<void, number>({
      query: (prerequisiteId) => ({
        url: `course-prerequisites/${prerequisiteId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetCoursePrerequisitesQuery, useAddCoursePrerequisiteMutation, useDeleteCoursePrerequisiteMutation } = coursePrerequisitesApi;
