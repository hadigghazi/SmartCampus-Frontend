import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Instructor } from './types'; 

const apiUrl = import.meta.env.VITE_BASE_URL; 

export const instructorsApi = createApi({
  reducerPath: 'instructorsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }), 
  endpoints: (builder) => ({
    getInstructors: builder.query<Instructor[], void>({
      query: () => 'instructors',
    }),
    getInstructorById: builder.query<Instructor, number>({
      query: (id) => `instructors/${id}`,
    }),
    addInstructor: builder.mutation<Instructor, Partial<Instructor>>({
      query: (instructor) => ({
        url: 'instructors',
        method: 'POST',
        body: instructor,
      }),
    }),
    updateInstructor: builder.mutation({
      query: (instructor) => ({
        url: `instructors/${instructor.id}`, 
        method: 'PUT',
        body: instructor,
      }),
    }),
    deleteInstructor: builder.mutation<void, number>({
      query: (id) => ({
        url: `instructors/${id}`,
        method: 'DELETE',
      }),
    }),
    getInstructorsWithUserDetails: builder.query({
        query: () => 'instructors-with-users',
      }),
      getInstructorByUserId: builder.query<Instructor, number>({
        query: (userId) => `/instructors/user/${userId}`,
      }),
  }),
});

export const {
  useGetInstructorsQuery,
  useGetInstructorByIdQuery,
  useAddInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
  useGetInstructorsWithUserDetailsQuery,
  useGetInstructorByUserIdQuery
} = instructorsApi;
