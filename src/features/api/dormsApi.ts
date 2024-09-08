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
      getDormRegistrations: builder.query<DormRoomRegistration[], void>({
        query: () => 'dorm_registrations',
      }),
  
      getDormRegistrationsForRoom: builder.query<DormRoomRegistration[], number>({
        query: (id) => `dorm_registrations_for_room/${id}`,
      }),
  
      getDormRegistrationById: builder.query<DormRoomRegistration, number>({
        query: (id) => `dorm_registrations/${id}`,
      }),
  
      createDormRegistration: builder.mutation({
        query: (registration) => ({
          url: 'dorm_registrations',
          method: 'POST',
          body: registration,
        }),
      }),
  
      updateDormRegistration: builder.mutation({
        query: ({ id, registration }) => ({
          url: `dorm_registrations/${id}`,
          method: 'PUT',
          body: registration,
        }),
      }),
  
      deleteDormRegistration: builder.mutation<void, number>({
        query: (id) => ({
          url: `dorm_registrations/${id}`,
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
  useGetDormRegistrationsQuery,
  useGetDormRegistrationsForRoomQuery,
  useGetDormRegistrationByIdQuery,
  useCreateDormRegistrationMutation,
  useUpdateDormRegistrationMutation,
  useDeleteDormRegistrationMutation,
} = dormsApi;
