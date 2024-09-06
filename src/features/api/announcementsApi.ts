import { createApi } from '@reduxjs/toolkit/query/react';
import { Announcement } from './types'; 
import { baseQuery } from './baseQuery';

export const announcementsApi = createApi({
  reducerPath: '/announcementsApi',
  baseQuery, 
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
