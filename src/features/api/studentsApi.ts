import { createApi } from '@reduxjs/toolkit/query/react';
import { Student } from './types'; 
import { baseQuery } from './baseQuery';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery,
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => '/students',
    }),
    getStudentById: builder.query<Student, number>({
        query: (id) => `/students/${id}`,
      }),
    getStudentByUserId: builder.query<Student, number>({
      query: (userId) => `/students/user/${userId}`,
    }),
    createStudent: builder.mutation<Student, Partial<Student>>({
      query: (studentData) => ({
        url: `/students`,
        method: 'POST',
        body: studentData,
      }),
    }),
    updateStudent: builder.mutation<Student, Partial<Student> & { id: number }>({
      query: (student) => ({
        url: `/students/${student.id}`,
        method: 'PUT',
        body: student,
      }),
    }),
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
    }),
    getStudentsWithUserDetails: builder.query({
        query: () => 'students-with-users',
      }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByUserIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentByIdQuery,
  useGetStudentsWithUserDetailsQuery
} = studentsApi;
