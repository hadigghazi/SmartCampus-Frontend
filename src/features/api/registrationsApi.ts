import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Registration } from './types';

const apiUrl = import.meta.env.VITE_BASE_URL;

export const registrationsApi = createApi({
  reducerPath: 'registrationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRegistrations: builder.query<Registration[], void>({
      query: () => 'registrations',
    }),
    getRegistrationById: builder.query<Registration, number>({
      query: (id) => `registrations/${id}`,
    }),
    getRegistrationsByStudent: builder.query<Registration, number>({
        query: (id) => `student/${id}/registration`,
      }),
    createRegistration: builder.mutation<Registration, Partial<Registration>>({
      query: (newRegistration) => ({
        url: 'registrations',
        method: 'POST',
        body: newRegistration,
      }),
    }),
    updateRegistration: builder.mutation<Registration, Partial<Registration> & { id: number }>({
      query: ({ id, ...updates }) => ({
        url: `registrations/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteRegistration: builder.mutation<void, number>({
      query: (id) => ({
        url: `registrations/${id}`,
        method: 'DELETE',
      }),
    }),
    getRegisteredStudents: builder.query({
      query: (id) => `course-instructor-students/${id}`, 
    }),
    getAvailableCoursesForStudent: builder.query({
      query: () => `available-courses/student`,
    }),
    suggestCourses: builder.query({
      query: () => 'suggest-courses',
    }),
  }),
});

export const {
  useGetRegistrationsQuery,
  useGetRegistrationByIdQuery,
  useCreateRegistrationMutation,
  useUpdateRegistrationMutation,
  useDeleteRegistrationMutation,
  useGetRegistrationsByStudentQuery,
  useGetRegisteredStudentsQuery,
  useGetAvailableCoursesForStudentQuery,
  useSuggestCoursesQuery
} = registrationsApi;
