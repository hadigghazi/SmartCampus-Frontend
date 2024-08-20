import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Faculty {
  id: number;
  name: string;
  location: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const facultiesApi = createApi({
  reducerPath: 'facultiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }), 
  endpoints: (builder) => ({
    getFaculties: builder.query<Faculty[], void>({
      query: () => 'faculties',
    }),
  }),
});

export const { useGetFacultiesQuery } = facultiesApi;
