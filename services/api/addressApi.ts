import baseApi from "./baseApi";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<any, void>({
      query: () => "/api/address",
      providesTags: ["Order"], // Assuming address might affect orders, or use a separate tag
    }),
    createAddress: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/address",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    updateAddress: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/api/address/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteAddress: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
