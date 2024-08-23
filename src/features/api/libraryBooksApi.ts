import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LibraryBook } from './types';
const apiUrl = import.meta.env.VITE_BASE_URL; 

export const libraryBooksApi = createApi({
  reducerPath: 'libraryBooksApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    getLibraryBooks: builder.query<LibraryBook[], void>({
      query: () => '/library_books',
    }),
    getLibraryBookById: builder.query<LibraryBook, number>({
      query: (id) => `/library_books/${id}`,
    }),
    createLibraryBook: builder.mutation<LibraryBook, Partial<LibraryBook>>({
      query: (newBook) => ({
        url: '/library_books',
        method: 'POST',
        body: newBook,
      }),
    }),
    updateLibraryBook: builder.mutation<LibraryBook, { id: number; book: Partial<LibraryBook> }>({
      query: ({ id, book }) => ({
        url: `/library_books/${id}`,
        method: 'PUT',
        body: book,
      }),
    }),
    deleteLibraryBook: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/library_books/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetLibraryBooksQuery,
  useGetLibraryBookByIdQuery,
  useCreateLibraryBookMutation,
  useUpdateLibraryBookMutation,
  useDeleteLibraryBookMutation,
} = libraryBooksApi;
