import { createApi } from '@reduxjs/toolkit/query/react';
import { LibraryBook } from './types';
import { baseQuery } from './baseQuery';

export const libraryBooksApi = createApi({
  reducerPath: 'libraryBooksApi',
  baseQuery,
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
    updateLibraryBook: builder.mutation<LibraryBook, { book: LibraryBook }>({
      query: ({ book }) => ({
        url: `/library_books/${book.id}`,
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
