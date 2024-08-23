import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiUrl = import.meta.env.VITE_BASE_URL;

export const borrowRequestsApi = createApi({
  reducerPath: 'borrowRequestsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
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
      query: (id: number) => ({
        url: `borrow-requests/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetBorrowRequestsByBookIdQuery, useUpdateBorrowRequestStatusMutation } = borrowRequestsApi;
