import { createApi } from '@reduxjs/toolkit/query/react';
import { News } from './types'; 
import { baseQuery } from './baseQuery';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery, 
  endpoints: (builder) => ({
    getNews: builder.query<News[], void>({
      query: () => 'news',
    }),
    getNewsById: builder.query<News, number>({
      query: (id) => `news/${id}`,
    }),
    addNews: builder.mutation<News, Partial<News>>({
      query: (news) => ({
        url: 'news',
        method: 'POST',
        body: news,
      }),
    }),
    updateNews: builder.mutation<News, Partial<News> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `news/${id}`,
        method: 'PUT',
        body: rest,
      }),
    }),
    deleteNews: builder.mutation<void, number>({
      query: (id) => ({
        url: `news/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useAddNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
