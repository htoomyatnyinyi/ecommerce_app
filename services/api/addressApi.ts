import baseApi from "./baseApi";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<any, void>({
      query: () => "/api/address",
      providesTags: ["Address", "Order"],
    }),
    createAddress: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/address",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Address", "Order"],
    }),
    updateAddress: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/api/address/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Address", "Order"],
    }),
    deleteAddress: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address", "Order"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
