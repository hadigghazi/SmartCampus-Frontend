import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const majorsApi = createApi({
  reducerPath: 'majorsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), 
  endpoints: (builder) => ({
    getMajors: builder.query({
      query: () => '/majors',
    }),
    getMajorById: builder.query({
      query: (id) => `/majors/${id}`,
    }),
    addMajor: builder.mutation({
      query: (newMajor) => ({
        url: '/majors',
        method: 'POST',
        body: newMajor,
      }),
    }),
    updateMajor: builder.mutation({
      query: ({ id, ...updatedMajor }) => ({
        url: `/majors/${id}`,
        method: 'PUT',
        body: updatedMajor,
      }),
    }),
    deleteMajor: builder.mutation({
      query: (id) => ({
        url: `/majors/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { 
  useGetMajorsQuery, 
  useGetMajorByIdQuery, 
  useAddMajorMutation, 
  useUpdateMajorMutation, 
  useDeleteMajorMutation 
} = majorsApi;
