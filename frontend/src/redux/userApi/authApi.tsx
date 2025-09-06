import { baseApi } from "../baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/api/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<any, void>({
      query: () => ({
        url: "/api/auth/getMe",
        method: "GET",
      }),
        keepUnusedDataFor: Number.MAX_VALUE, // Ne jamais supprimer du cache
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useLogoutMutation } = authApi;

