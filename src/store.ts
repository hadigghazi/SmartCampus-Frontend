import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { authApi } from './features/api/authApi';
import { newsApi } from './features/api/newsApi'; 

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(newsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
