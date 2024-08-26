import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Registration } from './types';

const apiUrl = import.meta.env.VITE_BASE_URL;

export const registrationsApi = createApi({
  reducerPath: 'registrationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    getRegistrations: builder.query<Registration[], void>({
      query: () => 'registrations',
    }),
    getRegistrationById: builder.query<Registration, number>({
      query: (id) => `registrations/${id}`,
    }),
    getRegistrationsByStudent: builder.query<Registration, number>({
        query: (id) => `student/${id}/registration`,
      }),
    createRegistration: builder.mutation<Registration, Partial<Registration>>({
      query: (newRegistration) => ({
        url: 'registrations',
        method: 'POST',
        body: newRegistration,
      }),
    }),
    updateRegistration: builder.mutation<Registration, Partial<Registration> & { id: number }>({
      query: ({ id, ...updates }) => ({
        url: `registrations/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteRegistration: builder.mutation<void, number>({
      query: (id) => ({
        url: `registrations/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetRegistrationsQuery,
  useGetRegistrationByIdQuery,
  useCreateRegistrationMutation,
  useUpdateRegistrationMutation,
  useDeleteRegistrationMutation,
  useGetRegistrationsByStudentQuery
} = registrationsApi;
