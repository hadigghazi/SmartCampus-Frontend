import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CourseMaterial } from './types';

const apiUrl = import.meta.env.VITE_BASE_URL;

export const courseMaterialsApi = createApi({
  reducerPath: 'courseMaterialsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    fetchCourseMaterialsByInstructor: builder.query<CourseMaterial[], number>({
      query: (courseInstructorId) => `instructor-courses/${courseInstructorId}/materials`,
    }),
    fetchCourseMaterialById: builder.query<CourseMaterial, number>({
      query: (id) => `course-materials/${id}`,
    }),
    downloadCourseMaterial: builder.query<Blob, number>({
      query: (id) => `course-materials/${id}/download`,
      transformResponse: (response: Response) => response.blob(),
    }),
    addCourseMaterial: builder.mutation<CourseMaterial, { courseInstructorId: number; data: FormData }>({
      query: ({ courseInstructorId, data }) => ({
        url: `/instructor-courses/${courseInstructorId}/materials`,
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      }),
    }),
    deleteCourseMaterial: builder.mutation<void, number>({
        query: (id) => ({
          url: `/course-materials/${id}`,
          method: 'DELETE',
        }),
      }),
      generatePracticeQuestions: builder.mutation({
        query: (fileData) => ({
          url: '/generate-practice-questions',
          method: 'POST',
          body: fileData,
        }),
      }),
  }),
});

export const {
  useFetchCourseMaterialsByInstructorQuery,
  useFetchCourseMaterialByIdQuery,
  useDownloadCourseMaterialQuery,
  useAddCourseMaterialMutation,
  useDeleteCourseMaterialMutation,
  useGeneratePracticeQuestionsMutation
} = courseMaterialsApi;
