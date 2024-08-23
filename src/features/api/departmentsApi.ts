import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Department } from './types'; 

const apiUrl = import.meta.env.VITE_BASE_URL;

export const departmentsApi = createApi({
  reducerPath: 'departmentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => '/departments',
    }),
    getDepartmentById: builder.query<Department, number>({
      query: (id) => `/departments/${id}`,
    }),
    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (department) => ({
        url: '/departments',
        method: 'POST',
        body: department,
      }),
    }),
    updateDepartment: builder.mutation<void, Department>({
      query: (department) => ({
        url: `/departments/${department.id}`,
        method: 'PUT',
        body: department,
      }),
    }),
    deleteDepartment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
