import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { SalaryPayment } from './types';

export const salaryPaymentsApi = createApi({
  reducerPath: 'salaryPaymentsApi',
  baseQuery,
  endpoints: (builder) => ({
    getSalaryPayments: builder.query<SalaryPayment[], void>({
      query: () => 'salary-payments',
    }),
    getSalaryPaymentById: builder.query<SalaryPayment, number>({
      query: (id) => `salary-payments/${id}`,
    }),
    addSalaryPayment: builder.mutation<SalaryPayment, Partial<SalaryPayment>>({
      query: (salaryPayment) => ({
        url: 'salary-payments',
        method: 'POST',
        body: salaryPayment,
      }),
    }),
    updateSalaryPayment: builder.mutation<SalaryPayment, Partial<SalaryPayment>>({
      query: (salaryPayment) => ({
        url: `salary-payments/${salaryPayment.id}`,
        method: 'PUT',
        body: salaryPayment,
      }),
    }),
    deleteSalaryPayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `salary-payments/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetSalaryPaymentsQuery,
  useGetSalaryPaymentByIdQuery,
  useAddSalaryPaymentMutation,
  useUpdateSalaryPaymentMutation,
  useDeleteSalaryPaymentMutation,
} = salaryPaymentsApi;
