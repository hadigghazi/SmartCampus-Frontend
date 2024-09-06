import { createApi } from '@reduxjs/toolkit/query/react';
import { Submission } from './types';
import { baseQuery } from './baseQuery';

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
    getAllSubmissions: builder.query<Submission[], number>({
        query: (assignmentId) => `assignments/${assignmentId}/all-submissions`,
      }),
  }),
});

export const {
  useFetchSubmissionsByAssignmentQuery,
  useFetchSubmissionByIdQuery,
  useDownloadSubmissionQuery,
  useAddSubmissionMutation,
  useDeleteSubmissionMutation,
  useGetAllSubmissionsQuery
} = submissionsApi;
