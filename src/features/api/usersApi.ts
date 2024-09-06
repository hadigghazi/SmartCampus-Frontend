import { createApi } from '@reduxjs/toolkit/query/react';
import { User } from './types'; 
import { baseQuery } from './baseQuery';


export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
    
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
    }),

    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
    }),

    updateUser: builder.mutation<User, Partial<User> & { id: number }>({
      query: ({ id, ...updatedUser }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      }),
    }),
    
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
