import { createApi } from '@reduxjs/toolkit/query/react';
import { FinancialAidScholarship } from './types'; // Adjust the import according to your project structure
import { baseQuery } from './baseQuery';

export const financialAidApi = createApi({
  reducerPath: 'financialAidApi',
  baseQuery, 
  endpoints: (builder) => ({
    getFinancialAidsScholarshipsByStudent: builder.query<FinancialAidScholarship[], number>({
      query: (studentId) => `financial-aid-scholarships/student/${studentId}`,
    }),
    createFinancialAidScholarship: builder.mutation<FinancialAidScholarship, Partial<FinancialAidScholarship>>({
      query: (newAid) => ({
        url: 'financial-aid-scholarships',
        method: 'POST',
        body: newAid,
      }),
    }),
    deleteFinancialAidScholarship: builder.mutation<void, number>({
      query: (id) => ({
        url: `financial-aid-scholarships/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetFinancialAidsScholarshipsByStudentQuery,
  useCreateFinancialAidScholarshipMutation,
  useDeleteFinancialAidScholarshipMutation,
} = financialAidApi;
