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
    addCourseMaterial: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: 'course-materials',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useFetchCourseMaterialsByInstructorQuery,
  useFetchCourseMaterialByIdQuery,
  useDownloadCourseMaterialQuery,
  useAddCourseMaterialMutation,
} = courseMaterialsApi;
