import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }), 
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: { status },
      }),
    }),
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
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useGetStudentsQuery,
  useGetStudentByUserIdQuery,
  useCreateStudentMutation,
} = usersApi;
