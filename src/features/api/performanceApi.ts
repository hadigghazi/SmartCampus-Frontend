import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_FAST_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const performanceApi = createApi({
  reducerPath: 'performanceApi',
  baseQuery,
  endpoints: (builder) => ({
    predict: builder.query({
      query: (course_instructor_id) => ({
        url: '/predict',
        params: { course_instructor_id },
      }),
    }),

    getCoursePerformanceOverview: builder.query({
      query: (course_instructor_id) => ({
        url: '/course-performance-overview',
        params: { course_instructor_id },
        responseHandler: (response) => response.blob().then((blob) => URL.createObjectURL(blob)),
      }),
    }),

    getBenchmarkComparisonDiagram: builder.query({
      query: (course_instructor_id) => ({
        url: '/benchmark-comparison-diagram',
        params: { course_instructor_id },
        responseHandler: (response) => response.blob().then((blob) => URL.createObjectURL(blob)),
      }),
    }),
  }),
});

export const {
  usePredictQuery,
  useGetCoursePerformanceOverviewQuery,
  useGetBenchmarkComparisonDiagramQuery,
} = performanceApi;
