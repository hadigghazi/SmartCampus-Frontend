import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Campus, Faculty } from './types';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const campusesApi = createApi({
  reducerPath: 'campusesApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }), 
  endpoints: (builder) => ({
    getCampuses: builder.query<Campus[], void>({
      query: () => '/campuses',
    }),
    getCampusById: builder.query<Campus, number>({
      query: (id) => `/campuses/${id}`,
    }),
    createCampus: builder.mutation<Campus, Partial<Campus>>({
      query: (newCampus) => ({
        url: '/campuses',
        method: 'POST',
        body: newCampus,
      }),
    }),
    updateCampus: builder.mutation<Campus, Partial<Campus> & { id: number }>({
      query: ({ id, ...updates }) => ({
        url: `/campuses/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteCampus: builder.mutation<void, number>({
      query: (id) => ({
        url: `/campuses/${id}`,
        method: 'DELETE',
      }),
    }),
    getFacultiesByCampus: builder.query<Faculty[], number>({
      query: (id) => `campuses/${id}/faculties`,
    }),
    getMajorsByFacultyAndCampus: builder.query({
      query: ({ facultyId, campusId }) => `majors/${facultyId}/campuses/${campusId}`,
    }),
  }),
});

export const {
  useGetCampusesQuery,
  useGetCampusByIdQuery,
  useCreateCampusMutation,
  useUpdateCampusMutation,
  useDeleteCampusMutation,
  useGetFacultiesByCampusQuery,
  useGetMajorsByFacultyAndCampusQuery
} = campusesApi;
