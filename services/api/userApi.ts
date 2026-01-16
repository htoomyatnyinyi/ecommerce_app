import baseApi from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<any, { username: string }>({
      query: (body) => ({
        url: "/api/user/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/user/password",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation, useUpdatePasswordMutation } = userApi;
