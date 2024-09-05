import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Fee, Payment } from './types';

const apiUrl = import.meta.env.VITE_BASE_URL;

export const feesPaymentsApi = createApi({
  reducerPath: 'feesPaymentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFees: builder.query<Fee[], void>({
      query: () => 'fees',
    }),
    getFeeById: builder.query<Fee, number>({
      query: (id) => `fees/${id}`,
    }),
    getFeesByStudent: builder.query<Fee[], number>({
      query: (studentId) => `fees_for_student/${studentId}`,
    }),
    createFee: builder.mutation<Fee, Partial<Fee>>({
      query: (newFee) => ({
        url: 'fees',
        method: 'POST',
        body: newFee,
      }),
    }),
    updateFee: builder.mutation<Fee, Partial<Fee> & { id: number }>({
      query: ({ id, ...updates }) => ({
        url: `fees/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteFee: builder.mutation<void, number>({
      query: (id) => ({
        url: `fees/${id}`,
        method: 'DELETE',
      }),
    }),
    getTotalFeesByStudent: builder.query({
      query: (id) => `total_fees_for_student/${id}`,
    }),

    getPayments: builder.query<Payment[], void>({
      query: () => 'payments',
    }),
    getPaymentById: builder.query<Payment, number>({
      query: (id) => `payments/${id}`,
    }),
    getPaymentsByStudent: builder.query<Payment[], number>({
      query: (studentId) => `payments_for_student/${studentId}`,
    }),
    createPayment: builder.mutation<Payment, Partial<Payment>>({
      query: (newPayment) => ({
        url: 'payments',
        method: 'POST',
        body: newPayment,
      }),
    }),
    updatePayment: builder.mutation<Payment, Partial<Payment> & { id: number }>({
      query: ({ id, ...updates }) => ({
        url: `payments/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deletePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `payments/${id}`,
        method: 'DELETE',
      }),
    }),
    checkFeesPaid: builder.query({
      query: () => 'check-fees',
    }),
  }),
});

export const {
  useGetFeesQuery,
  useGetFeeByIdQuery,
  useGetFeesByStudentQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useDeleteFeeMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByStudentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetTotalFeesByStudentQuery,
  useCheckFeesPaidQuery
} = feesPaymentsApi;
