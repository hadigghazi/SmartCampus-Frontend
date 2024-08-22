import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Room } from '../api/types'; 

const apiUrl = import.meta.env.VITE_BASE_URL;

export const roomsApi = createApi({
  reducerPath: 'roomsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
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
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;
