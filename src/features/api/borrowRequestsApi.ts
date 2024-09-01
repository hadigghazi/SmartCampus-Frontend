import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_BASE_URL;

export const borrowRequestsApi = createApi({
  reducerPath: 'borrowRequestsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBorrowRequests: builder.query({
      query: () => '/book_borrows',
    }),
    getBorrowRequestsByBookId: builder.query({
      query: (bookId) => `book_borrows/by_book/${bookId}`,
    }),
    updateBorrowRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `book_borrows/${id}`,
        method: 'PUT',
        body: { status },
      }),
    }),
    deleteBorrowRequest: builder.mutation({
      query: (id) => ({
        url: `book_borrows/${id}`,
        method: 'DELETE',
      }),
    }),
    borrowBook: builder.mutation({
      query: (borrowDetails) => ({
        url: '/book-borrow',
        method: 'POST',
        body: borrowDetails,
      }),
    }),
  }),
});

export const {
  useGetBorrowRequestsQuery,
  useGetBorrowRequestsByBookIdQuery,
  useUpdateBorrowRequestStatusMutation,
  useDeleteBorrowRequestMutation,
  useBorrowBookMutation,
} = borrowRequestsApi;
