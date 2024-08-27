import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Dean } from './types';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const deansApi = createApi({
  reducerPath: 'deansApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }), 
  endpoints: (builder) => ({
    getDeans: builder.query<Dean[], void>({
      query: () => 'deans',
    }),
    getDeanById: builder.query<Dean, number>({
      query: (id) => `deans/${id}`,
    }),
    createDean: builder.mutation<void, Partial<Dean>>({
      query: (newDean) => ({
        url: 'deans',
        method: 'POST',
        body: newDean,
      }),
    }),
    updateDean: builder.mutation<void, Partial<Dean> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `deans/${id}`,
        method: 'PUT',
        body: rest,
      }),
    }),
    deleteDean: builder.mutation<void, number>({
      query: (id) => ({
        url: `deans/${id}`,
        method: 'DELETE',
      }),
    }),
    getDeansByCampus: builder.query<Dean[], number>({
        query: (campusId) => `deans/campus/${campusId}`,
      }),
    getDeanByFacultyAndCampus: builder.query({
        query: ({ facultyId, campusId }) => 
          `deans/${facultyId}/${campusId}`,
      }),
  }),
});

export const {
  useGetDeansQuery,
  useGetDeanByIdQuery,
  useCreateDeanMutation,
  useUpdateDeanMutation,
  useDeleteDeanMutation,
  useGetDeansByCampusQuery,
  useGetDeanByFacultyAndCampusQuery
} = deansApi;
