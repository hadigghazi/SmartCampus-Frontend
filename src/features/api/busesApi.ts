import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const api = createApi({
  reducerPath: 'busesApi',
  baseQuery,
  endpoints: (builder) => ({
    getBusRegistrations: builder.query({
      query: () => 'bus_registrations',
    }),
    
    getBusRegistrationById: builder.query({
      query: (id) => `bus_registrations/${id}`,
    }),

    createBusRegistration: builder.mutation({
      query: (newRegistration) => ({
        url: 'bus_registrations',
        method: 'POST',
        body: newRegistration,
      }),
    }),

    updateBusRegistration: builder.mutation({
      query: ({ id, updatedRegistration }) => ({
        url: `bus_registrations/${id}`,
        method: 'PUT',
        body: updatedRegistration,
      }),
    }),

    deleteBusRegistration: builder.mutation({
      query: (id) => ({
        url: `bus_registrations/${id}`,
        method: 'DELETE',
      }),
    }),

    getRegistrationsForBusRoute: builder.query({
      query: (id) => `bus_registrations_for_route/${id}`,
    }),

    getBusRoutes: builder.query({
      query: () => 'bus-routes',
    }),
    
    getBusRouteById: builder.query({
      query: (id) => `bus-routes/${id}`,
    }),

    createBusRoute: builder.mutation({
      query: (newBusRoute) => ({
        url: 'bus-routes',
        method: 'POST',
        body: newBusRoute,
      }),
    }),

    updateBusRoute: builder.mutation({
      query: ({ id, updatedBusRoute }) => ({
        url: `bus-routes/${id}`,
        method: 'PUT',
        body: updatedBusRoute,
      }),
    }),

    deleteBusRoute: builder.mutation({
      query: (id) => ({
        url: `bus-routes/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBusRegistrationsQuery,
  useGetBusRegistrationByIdQuery,
  useCreateBusRegistrationMutation,
  useUpdateBusRegistrationMutation,
  useDeleteBusRegistrationMutation,
  useGetRegistrationsForBusRouteQuery,
  useGetBusRoutesQuery,
  useGetBusRouteByIdQuery,
  useCreateBusRouteMutation,
  useUpdateBusRouteMutation,
  useDeleteBusRouteMutation,
} = api;
