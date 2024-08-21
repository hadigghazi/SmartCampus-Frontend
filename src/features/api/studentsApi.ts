import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }), 
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => '/students',
    }),
    getStudentByUserId: builder.query({
      query: (userId) => `/students/user/${userId}`,
    }),
    createStudent: builder.mutation({
      query: (studentData) => ({
        url: `/students`,
        method: 'POST',
        body: studentData,
      }),
    }),
    updateStudent: builder.mutation({
      query: ({ id, studentData }) => ({
        url: `/students/${id}`,
        method: 'PATCH',
        body: studentData,
      }),
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByUserIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
