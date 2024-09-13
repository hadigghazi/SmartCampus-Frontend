import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const performanceApi = createApi({
  reducerPath: 'performanceApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_FAST_API_URL }),
  endpoints: (builder) => ({
    getPrediction: builder.mutation({
      query: (course_instructor_id) => ({
        url: '/predict',
        method: 'POST',
        params: { course_instructor_id },
      }),
    }),
    getCoursePerformanceOverview: builder.mutation({
      query: (course_instructor_id) => ({
        url: '/course-performance-overview',
        method: 'POST',
        params: { course_instructor_id },
        responseHandler: (response) => response.blob(), 
      }),
    }),
    getBenchmarkComparisonDiagram: builder.mutation({
      query: (course_instructor_id) => ({
        url: '/benchmark-comparison-diagram',
        method: 'POST',
        params: { course_instructor_id },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetPredictionMutation,
  useGetCoursePerformanceOverviewMutation,
  useGetBenchmarkComparisonDiagramMutation,
} = performanceApi;
