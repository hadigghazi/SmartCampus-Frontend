import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from './types';
import { RootState } from '../../store';
import { isTokenExpired } from '../auth/jwtUtils';

const apiUrl = import.meta.env.VITE_BASE_URL;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        if (!isTokenExpired(token)) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      headers.set('Accept', `application/json`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => 'auth/me',
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useLoginMutation, 
  useLogoutMutation, 
  useRefreshTokenMutation, 
  useGetUserQuery 
} = authApi;

export default authApi;
