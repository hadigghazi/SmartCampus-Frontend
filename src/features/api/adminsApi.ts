import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Admin } from './types'; 

const apiUrl = import.meta.env.VITE_BASE_URL;

export const adminsApi = createApi({
  reducerPath: 'adminsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }), 
  endpoints: (builder) => ({
    getAdmins: builder.query<Admin[], void>({
      query: () => 'admins',
    }),
    getAdminById: builder.query<Admin, number>({
      query: (id) => `admins/${id}`,
    }),
    addAdmin: builder.mutation<Admin, Partial<Admin>>({
      query: (admin) => ({
        url: 'admins',
        method: 'POST',
        body: admin,
      }),
    }),
    updateAdmin: builder.mutation<Admin, Partial<Admin> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `admins/${id}`,
        method: 'PUT',
        body: rest,
      }),
    }),
    deleteAdmin: builder.mutation<void, number>({
      query: (id) => ({
        url: `admins/${id}`,
        method: 'DELETE',
      }),
    }),
    getAdminsWithUserDetails: builder.query({
        query: () => 'admins-with-users',
      }),
  }),
});

export const {
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useAddAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminsWithUserDetailsQuery
} = adminsApi;
