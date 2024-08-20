import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface News {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
}

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }), 
  endpoints: (builder) => ({
    getNews: builder.query<News[], void>({
      query: () => 'news',
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;
