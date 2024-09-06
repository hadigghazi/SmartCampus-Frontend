import { createApi } from '@reduxjs/toolkit/query/react';
import { Major } from '../api/types';
import { baseQuery } from './baseQuery';

export const majorsApi = createApi({
  reducerPath: 'majorsApi',
  baseQuery, 
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
    getMajorsByFaculty: builder.query({
        query: (facultyId: number) => `majors/faculty/${facultyId}`,
      }),
  }),
});

export const {
  useGetMajorsQuery,
  useGetMajorByIdQuery,
  useCreateMajorMutation,
  useUpdateMajorMutation,
  useDeleteMajorMutation,
  useGetMajorsByFacultyQuery,
} = majorsApi;
