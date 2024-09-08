import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { Dorm, DormRoom, DormRoomRegistration } from './types'; 

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
    getAllDormRooms: builder.query<DormRoom[], number>({
        query: (dormId) => `dorm-rooms?dorm_id=${dormId}`,
      }),
      getDormRoomById: builder.query<DormRoom, number>({
        query: (id) => `dorm-rooms/${id}`,
      }),
      createDormRoom: builder.mutation<DormRoom, Partial<DormRoom>>({
        query: (newDormRoom) => ({
          url: 'dorm-rooms',
          method: 'POST',
          body: newDormRoom,
        }),
      }),
      updateDormRoom: builder.mutation<DormRoom, { id: number; updates: Partial<DormRoom> }>({
        query: ({ id, updates }) => ({
          url: `dorm-rooms/${id}`,
          method: 'PUT',
          body: updates,
        }),
      }),
      deleteDormRoom: builder.mutation<void, number>({
        query: (id) => ({
          url: `dorm-rooms/${id}`,
          method: 'DELETE',
        }),
      }),
      getDormRoomRegistrations: builder.query<DormRoomRegistration[], number>({
        query: (dormRoomId) => `dorm-rooms/${dormRoomId}/registrations`,
      }),
      createDormRoomRegistration: builder.mutation<void, Partial<DormRoomRegistration>>({
        query: (registration) => ({
          url: 'dorm-room-registrations',
          method: 'POST',
          body: registration,
        }),
      }),
      updateDormRoomRegistration: builder.mutation<void, { id: number, updates: Partial<DormRoomRegistration> }>({
        query: ({ id, updates }) => ({
          url: `dorm-room-registrations/${id}`,
          method: 'PUT',
          body: updates,
        }),
      }),
      deleteDormRoomRegistration: builder.mutation<void, number>({
        query: (id) => ({
          url: `dorm-room-registrations/${id}`,
          method: 'DELETE',
        }),
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
  useGetAllDormRoomsQuery,
  useCreateDormRoomMutation,
  useDeleteDormRoomMutation,
  useGetDormRoomByIdQuery,
  useUpdateDormRoomMutation,
  useGetDormRoomRegistrationsQuery,
  useCreateDormRoomRegistrationMutation,
  useUpdateDormRoomRegistrationMutation,
  useDeleteDormRoomRegistrationMutation,
} = dormsApi;
