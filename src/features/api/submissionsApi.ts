import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Submission } from './types';

const apiUrl = import.meta.env.VITE_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token'); 

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const submissionsApi = createApi({
  reducerPath: 'submissionsApi',
  baseQuery,
  endpoints: (builder) => ({
    fetchSubmissionsByAssignment: builder.query<Submission[], number>({
      query: (assignmentId) => `assignments/${assignmentId}/submissions`,
    }),
    fetchSubmissionById: builder.query<Submission, number>({
      query: (id) => `submissions/${id}`,
    }),
    downloadSubmission: builder.query<Blob, number>({
      query: (id) => `submissions/${id}/download`,
      transformResponse: (response: Response) => response.blob(),
    }),
    addSubmission: builder.mutation<Submission, { assignmentId: number; data: FormData }>({
      query: ({ assignmentId, data }) => ({
        url: `assignments/${assignmentId}/submissions`,
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      }),
    }),
    deleteSubmission: builder.mutation<void, number>({
      query: (id) => ({
        url: `/submissions/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchSubmissionsByAssignmentQuery,
  useFetchSubmissionByIdQuery,
  useDownloadSubmissionQuery,
  useAddSubmissionMutation,
  useDeleteSubmissionMutation,
} = submissionsApi;
