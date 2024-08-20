import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from './types';
import { RootState } from '../../store';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/auth',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', `application/json`);
      return headers;
    },
  }),
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
    refreshToken: builder.mutation<LoginResponse, void>({
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

export default authApi;
