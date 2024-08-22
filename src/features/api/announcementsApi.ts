import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Announcement } from './types'; 
const apiUrl = import.meta.env.VITE_BASE_URL;

export const announcementsApi = createApi({
  reducerPath: '/announcementsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }), 
  endpoints: (builder) => ({
    getAnnouncements: builder.query<Announcement[], void>({
      query: () => '/announcements',
    }),
    getAnnouncementById: builder.query<Announcement, number>({
      query: (id) => `/announcements/${id}`,
    }),
    createAnnouncement: builder.mutation<Announcement, Partial<Announcement>>({
      query: (announcement) => ({
        url: '/announcements',
        method: 'POST',
        body: announcement,
      }),
    }),
    updateAnnouncement: builder.mutation<void, Announcement>({
        query: (announcement) => ({
          url: `/announcements/${announcement.id}`,
          method: 'PUT',
          body: announcement,
        }),
      }),
    deleteAnnouncement: builder.mutation<void, number>({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApi;
