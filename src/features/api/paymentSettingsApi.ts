import { createApi } from '@reduxjs/toolkit/query/react';
import { PaymentSetting } from './types';
import { baseQuery } from './baseQuery';

export const paymentSettingsApi = createApi({
  reducerPath: 'paymentSettingsApi',
  baseQuery,
  endpoints: (builder) => ({
    getPaymentSettings: builder.query<PaymentSetting[], void>({
      query: () => '/payment-settings',
    }),
    getPaymentSettingById: builder.query<PaymentSetting, number>({
      query: (id) => `/payment-settings/${id}`,
    }),
    createPaymentSetting: builder.mutation<PaymentSetting, Partial<PaymentSetting>>({
      query: (newSetting) => ({
        url: '/payment-settings',
        method: 'POST',
        body: newSetting,
      }),
    }),
    updatePaymentSetting: builder.mutation<PaymentSetting, { id: number; updates: Partial<PaymentSetting> }>({
      query: ({ id, updates }) => ({
        url: `/payment-settings/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deletePaymentSetting: builder.mutation<void, number>({
      query: (id) => ({
        url: `/payment-settings/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetPaymentSettingsQuery,
  useGetPaymentSettingByIdQuery,
  useCreatePaymentSettingMutation,
  useUpdatePaymentSettingMutation,
  useDeletePaymentSettingMutation,
} = paymentSettingsApi;
