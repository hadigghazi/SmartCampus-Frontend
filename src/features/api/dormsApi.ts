import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { Dorm, DormRoom } from './types'; 

export const dormsApi = createApi({
  reducerPath: 'dormsApi',
  baseQuery,
  endpoints: (builder) => ({
    getDorms: builder.query<Dorm[], void>({
      query: () => 'dorms',
    }),
    getDormById: builder.query<Dorm, number>({
      query: (id) => `dorms/${id}`,
    }),
    createDorm: builder.mutation<Dorm, Partial<Dorm>>({
      query: (newDorm) => ({
        url: 'dorms',
        method: 'POST',
        body: newDorm,
      }),
    }),
    updateDorm: builder.mutation<Dorm, Partial<Dorm> & { id: number }>({
      query: ({ id, ...updates }) => ({
        url: `dorms/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteDorm: builder.mutation<void, number>({
      query: (id) => ({
        url: `dorms/${id}`,
        method: 'DELETE',
      }),
    }),
    getDormRoomsByDorm: builder.query<DormRoom[], number>({
      query: (dormId) => `dorms/${dormId}/rooms`,
    }),
  }),
});

export const {
  useGetDormsQuery,
  useGetDormByIdQuery,
  useCreateDormMutation,
  useUpdateDormMutation,
  useDeleteDormMutation,
  useGetDormRoomsByDormQuery,
} = dormsApi;
