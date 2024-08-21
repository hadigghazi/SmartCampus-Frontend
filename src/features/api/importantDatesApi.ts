import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ImportantDate } from './types';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const importantDatesApi = createApi({
  reducerPath: 'importantDatesApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    getImportantDates: builder.query<ImportantDate[], void>({
      query: () => 'important_dates',
    }),
    getImportantDateById: builder.query<ImportantDate, number>({
      query: (id) => `important_dates/${id}`,
    }),
    createImportantDate: builder.mutation<void, Partial<ImportantDate>>({
      query: (newDate) => ({
        url: 'important_dates',
        method: 'POST',
        body: newDate,
      }),
    }),
    updateImportantDate: builder.mutation<void, Partial<ImportantDate> & { id: number }>({
      query: ({ id, ...updatedDate }) => ({
        url: `important_dates/${id}`,
        method: 'PUT',
        body: updatedDate,
      }),
    }),
    deleteImportantDate: builder.mutation<void, number>({
      query: (id) => ({
        url: `important_dates/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetImportantDatesQuery,
  useGetImportantDateByIdQuery,
  useCreateImportantDateMutation,
  useUpdateImportantDateMutation,
  useDeleteImportantDateMutation,
} = importantDatesApi;
