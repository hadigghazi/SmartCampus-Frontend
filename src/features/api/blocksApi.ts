import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Block } from '../api/types'; 

const apiUrl = import.meta.env.VITE_BASE_URL;

export const blocksApi = createApi({
  reducerPath: 'blocksApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  tagTypes: ['Block'],
  endpoints: (builder) => ({
    getBlocks: builder.query<Block[], void>({
      query: () => '/blocks',
    }),
    getBlockById: builder.query<Block, number>({
      query: (id) => `/blocks/${id}`,
    }),
    createBlock: builder.mutation<Block, Partial<Block>>({
      query: (newBlock) => ({
        url: '/blocks',
        method: 'POST',
        body: newBlock,
      }),
    }),
    updateBlock: builder.mutation<Block, Partial<Block> & Pick<Block, 'id'>>({
      query: ({ id, ...updatedBlock }) => ({
        url: `/blocks/${id}`,
        method: 'PUT',
        body: updatedBlock,
      }),
    }),
    deleteBlock: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/blocks/${id}`,
        method: 'DELETE',
      }),
    }),
    getBlocksByCampus: builder.query<Block[], string>({
        query: (campusId) => `/blocks-by-campus/${campusId}`,
      }),
  }),
});

export const {
  useGetBlocksQuery,
  useGetBlockByIdQuery,
  useCreateBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  useGetBlocksByCampusQuery
} = blocksApi;
