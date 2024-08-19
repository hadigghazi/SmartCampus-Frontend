import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, User } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/auth' }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
    }),
    refreshToken: builder.mutation<RegisterResponse, void>({
      query: () => ({
        url: 'refresh',
        method: 'POST',
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => 'me',
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
