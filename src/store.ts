import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { authApi } from './features/api/authApi';
import { newsApi } from './features/api/newsApi'; 
import { facultiesApi } from './features/api/facultiesApi'; 
import { importantDatesApi } from './features/api/importantDatesApi'; 
import { majorsApi } from './features/api/majorsApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [facultiesApi.reducerPath]: facultiesApi.reducer,
    [importantDatesApi.reducerPath]: importantDatesApi.reducer,
    [majorsApi.reducerPath]: majorsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(newsApi.middleware)
  .concat(facultiesApi.middleware)
  .concat(importantDatesApi.middleware)
  .concat(majorsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
