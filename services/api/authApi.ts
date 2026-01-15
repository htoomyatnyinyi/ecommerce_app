import * as SecureStore from "expo-secure-store";
// import { baseApi } from "./baseApi";
import baseApi from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    signIn: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/signin",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken) {
            await SecureStore.setItemAsync("accessToken", data.accessToken);
          }
          if (data.refreshToken) {
            await SecureStore.setItemAsync("refreshToken", data.refreshToken);
          }
        } catch (err) {
          // Handle error
        }
      },
      invalidatesTags: ["User"],
    }),
    
    signUp: builder.mutation({
      query: (userData) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    
    authMe: builder.query({
      query: () => "/api/auth/auth-me",
      providesTags: ["User"],
    }),

    signOut: builder.mutation({
      query: () => ({
        url: "/api/auth/signout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        await queryFulfilled;
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useAuthMeQuery,
  useSignOutMutation,
} = authApi;
