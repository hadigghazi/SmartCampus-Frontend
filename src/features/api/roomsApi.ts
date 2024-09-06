import { createApi } from '@reduxjs/toolkit/query/react';
import { Room } from '../api/types'; 
import { baseQuery } from './baseQuery';

export const roomsApi = createApi({
  reducerPath: 'roomsApi',
  baseQuery,
  tagTypes: ['Room'],
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => '/rooms',
    }),
    getRoomById: builder.query<Room, number>({
      query: (id) => `/rooms/${id}`,
    }),
    createRoom: builder.mutation<Room, Partial<Room>>({
      query: (newRoom) => ({
        url: '/rooms',
        method: 'POST',
        body: newRoom,
      }),
    }),
    updateRoom: builder.mutation<Room, Partial<Room> & Pick<Room, 'id'>>({
      query: ({ id, ...updatedRoom }) => ({
        url: `/rooms/${id}`,
        method: 'PUT',
        body: updatedRoom,
      }),
    }),
    deleteRoom: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
    }),
    getRoomsByBlock: builder.query<Room[], string>({
      query: (blockId) => `/rooms-by-block/${blockId}`,
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsByBlockQuery
} = roomsApi;
