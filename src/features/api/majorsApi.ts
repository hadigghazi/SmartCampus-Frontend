import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Major } from '../api/types';

export const majorsApi = createApi({
  reducerPath: 'majorsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }), 
  tagTypes: ['Major'],
  endpoints: (builder) => ({
    getMajors: builder.query<Major[], void>({
      query: () => '/majors',
  }),
    getMajorById: builder.query<Major, number>({
      query: (id) => `/majors/${id}`,
    }),
    createMajor: builder.mutation<Major, Partial<Major>>({
      query: (newMajor) => ({
        url: '/majors',
        method: 'POST',
        body: newMajor,
      }),
    }),
    updateMajor: builder.mutation<Major, Partial<Major> & Pick<Major, 'id'>>({
      query: ({ id, ...updatedMajor }) => ({
        url: `/majors/${id}`,
        method: 'PUT',
        body: updatedMajor,
      }),
    }),
    deleteMajor: builder.mutation<{ success: boolean; id: number }, number>({
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
  useCreateMajorMutation,
  useUpdateMajorMutation,
  useDeleteMajorMutation,
} = majorsApi;
