import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { authApi } from './features/api/authApi';
import { newsApi } from './features/api/newsApi'; 
import { facultiesApi } from './features/api/facultiesApi'; 
import { importantDatesApi } from './features/api/importantDatesApi'; 
import { majorsApi } from './features/api/majorsApi';
import { campusesApi } from './features/api/campusesApi';
import { centersApi } from './features/api/centersApi';
import { coursesApi } from './features/api/coursesApi';
import { deansApi } from './features/api/deansApi';
import { usersApi } from './features/api/usersApi';
import { studentsApi } from './features/api/studentsApi';
import { instructorsApi } from './features/api/instructorsApi';
import { semestersApi } from './features/api/semesterApi';
import { roomsApi } from './features/api/roomsApi';
import { announcementsApi } from './features/api/announcementsApi';
import { libraryBooksApi } from './features/api/libraryBooksApi';
import { borrowRequestsApi } from './features/api/borrowRequestsApi';
import { departmentsApi } from './features/api/departmentsApi';
import { blocksApi } from './features/api/blocksApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [facultiesApi.reducerPath]: facultiesApi.reducer,
    [importantDatesApi.reducerPath]: importantDatesApi.reducer,
    [majorsApi.reducerPath]: majorsApi.reducer,
    [campusesApi.reducerPath]: campusesApi.reducer,
    [centersApi.reducerPath]: centersApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [deansApi.reducerPath]: deansApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [instructorsApi.reducerPath]: instructorsApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [semestersApi.reducerPath]: semestersApi.reducer,
    [announcementsApi.reducerPath]: announcementsApi.reducer,
    [libraryBooksApi.reducerPath]: libraryBooksApi.reducer,
    [borrowRequestsApi.reducerPath]: borrowRequestsApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [blocksApi.reducerPath]: blocksApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(newsApi.middleware)
  .concat(facultiesApi.middleware)
  .concat(importantDatesApi.middleware)
  .concat(majorsApi.middleware)
  .concat(campusesApi.middleware)
  .concat(centersApi.middleware)
  .concat(coursesApi.middleware)
  .concat(deansApi.middleware)
  .concat(usersApi.middleware)
  .concat(studentsApi.middleware)
  .concat(instructorsApi.middleware)
  .concat(roomsApi.middleware)
  .concat(semestersApi.middleware)
  .concat(announcementsApi.middleware)
  .concat(libraryBooksApi.middleware)
  .concat(borrowRequestsApi.middleware)
  .concat(departmentsApi.middleware)
  .concat(blocksApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
